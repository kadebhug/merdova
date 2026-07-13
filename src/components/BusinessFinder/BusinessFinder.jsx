import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import './BusinessFinder.css';

const PLACES_API_KEY_STORAGE = 'places_api_key';
const CACHE_STORAGE_KEY = 'business_finder_session_cache_v1';
/** Geocode + full search results; sessionStorage clears with the tab. */
const CACHE_TTL_MS = 30 * 60 * 1000;
const PER_PAGE = 25;

/** In dev, true when vite.config.js has GOOGLE_MAPS_API_KEY (requests proxied; key not sent from the browser). */
const MAPS_DEV_PROXY = __MAPS_DEV_PROXY__;
const MAPS_BROWSER_KEY = (import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '').trim();
const FETCH_TIMEOUT_MS = 20000;

function formatGoogleMapsError(data, label) {
  const status = data?.status ?? 'UNKNOWN';
  const detail = data?.error_message ? ` — ${data.error_message}` : '';
  return `${label}: ${status}${detail}`;
}

function mapsFetchPath(suffixPath, searchParams) {
  const qs = searchParams.toString();
  if (MAPS_DEV_PROXY) return `/__google-maps${suffixPath}?${qs}`;
  return `https://maps.googleapis.com/maps/api${suffixPath}?${qs}`;
}

function withTimeout(signal, timeoutMs = FETCH_TIMEOUT_MS) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  const cleanup = () => clearTimeout(timeoutId);

  if (!signal) return { signal: controller.signal, cleanup };

  const abortHandler = () => controller.abort();
  signal.addEventListener('abort', abortHandler, { once: true });

  return {
    signal: controller.signal,
    cleanup: () => {
      signal.removeEventListener('abort', abortHandler);
      cleanup();
    },
  };
}

function safeJsonParse(raw) {
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

async function fetchGoogleJson(path, params, { signal } = {}) {
  const { signal: timeoutSignal, cleanup } = withTimeout(signal);
  try {
    const response = await fetch(mapsFetchPath(path, params), { signal: timeoutSignal });
    const payload = safeJsonParse(await response.text());
    if (!response.ok) {
      const detail = payload?.error_message ? ` — ${payload.error_message}` : '';
      throw new Error(`Google request failed (${response.status})${detail}`);
    }
    if (!payload || typeof payload !== 'object') {
      throw new Error('Google API returned malformed data');
    }
    return payload;
  } finally {
    cleanup();
  }
}

const BUSINESS_TYPES = [
  { value: '', label: 'All types' },
  { value: 'accounting', label: 'Accounting' },
  { value: 'atm', label: 'ATM' },
  { value: 'bakery', label: 'Bakery' },
  { value: 'bank', label: 'Bank' },
  { value: 'bar', label: 'Bar' },
  { value: 'beauty_salon', label: 'Beauty Salon' },
  { value: 'cafe', label: 'Cafe' },
  { value: 'car_dealer', label: 'Car Dealer' },
  { value: 'car_repair', label: 'Car Repair' },
  { value: 'clothing_store', label: 'Clothing Store' },
  { value: 'convenience_store', label: 'Convenience Store' },
  { value: 'dentist', label: 'Dentist' },
  { value: 'doctor', label: 'Doctor' },
  { value: 'drugstore', label: 'Drugstore / Pharmacy' },
  { value: 'electrician', label: 'Electrician' },
  { value: 'electronics_store', label: 'Electronics Store' },
  { value: 'gym', label: 'Gym' },
  { value: 'hair_care', label: 'Hair Care' },
  { value: 'hardware_store', label: 'Hardware Store' },
  { value: 'hospital', label: 'Hospital' },
  { value: 'insurance_agency', label: 'Insurance Agency' },
  { value: 'laundry', label: 'Laundry' },
  { value: 'lawyer', label: 'Lawyer' },
  { value: 'lodging', label: 'Lodging / Hotel' },
  { value: 'meal_delivery', label: 'Meal Delivery' },
  { value: 'meal_takeaway', label: 'Takeaway' },
  { value: 'moving_company', label: 'Moving Company' },
  { value: 'painter', label: 'Painter' },
  { value: 'parking', label: 'Parking' },
  { value: 'pet_store', label: 'Pet Store' },
  { value: 'pharmacy', label: 'Pharmacy' },
  { value: 'physiotherapist', label: 'Physiotherapist' },
  { value: 'plumber', label: 'Plumber' },
  { value: 'real_estate_agency', label: 'Real Estate' },
  { value: 'restaurant', label: 'Restaurant' },
  { value: 'school', label: 'School' },
  { value: 'shopping_mall', label: 'Shopping Mall' },
  { value: 'spa', label: 'Spa' },
  { value: 'supermarket', label: 'Supermarket' },
  { value: 'travel_agency', label: 'Travel Agency' },
  { value: 'veterinary_care', label: 'Veterinary' },
];

function formatType(t) {
  return (t || '').replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

function normalizeLocationQuery(s) {
  return s.trim().toLowerCase().replace(/\s+/g, ' ');
}

function loadSessionCache() {
  try {
    const raw = sessionStorage.getItem(CACHE_STORAGE_KEY);
    if (!raw) return { geo: {}, search: {} };
    const p = JSON.parse(raw);
    return { geo: p.geo && typeof p.geo === 'object' ? p.geo : {}, search: p.search && typeof p.search === 'object' ? p.search : {} };
  } catch {
    return { geo: {}, search: {} };
  }
}

function saveSessionCache(data) {
  try {
    sessionStorage.setItem(CACHE_STORAGE_KEY, JSON.stringify(data));
  } catch {
    /* quota or private mode */
  }
}

function cacheEntryFresh(t) {
  return typeof t === 'number' && Date.now() - t < CACHE_TTL_MS;
}

async function geocode(address, apiKey, signal) {
  const params = new URLSearchParams({ address });
  if (!MAPS_DEV_PROXY) params.set('key', apiKey);
  const d = await fetchGoogleJson('/geocode/json', params, { signal });
  if (d.status !== 'OK') throw new Error(formatGoogleMapsError(d, 'Geocode failed'));
  return d.results[0].geometry.location;
}

async function nearbySearch(lat, lng, radius, type, apiKey, onStatus, signal) {
  const results = [];
  let pageToken = null;

  for (let i = 0; i < 3; i++) {
    const params = new URLSearchParams({
      location: `${lat},${lng}`,
      radius: String(radius),
    });
    if (type) params.set('type', type);
    if (pageToken) params.set('pagetoken', pageToken);
    if (!MAPS_DEV_PROXY) params.set('key', apiKey);

    const d = await fetchGoogleJson('/place/nearbysearch/json', params, { signal });

    if (!['OK', 'ZERO_RESULTS'].includes(d.status)) {
      throw new Error(formatGoogleMapsError(d, 'Nearby search failed'));
    }

    results.push(...(d.results || []));
    pageToken = d.next_page_token;

    if (!pageToken) break;
    await new Promise((res) => setTimeout(res, 2000));
    onStatus?.(`Loading more results (page ${i + 2})…`);
  }

  return results;
}

async function getDetails(placeId, apiKey, signal) {
  const params = new URLSearchParams({
    place_id: placeId,
    fields: 'formatted_phone_number,website',
  });
  if (!MAPS_DEV_PROXY) params.set('key', apiKey);
  const d = await fetchGoogleJson('/place/details/json', params, { signal });
  if (d.status === 'OK') return d.result || {};
  if (d.status === 'NOT_FOUND') return {};
  throw new Error(formatGoogleMapsError(d, 'Place details failed'));
}

function normalizeWebsiteUrl(url) {
  if (!url) return '';
  try {
    const normalized = new URL(url);
    return ['http:', 'https:'].includes(normalized.protocol) ? normalized.toString() : '';
  } catch {
    return '';
  }
}

function downloadBlob(filename, content, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function StatusBadge({ status }) {
  if (status === 'CLOSED_PERMANENTLY') {
    return <span className="bf-status-open bf-status-open--perm">Closed perm.</span>;
  }
  if (status === 'CLOSED_TEMPORARILY') {
    return <span className="bf-status-open bf-status-open--no">Temp. closed</span>;
  }
  return <span className="bf-no-data">—</span>;
}

export default function BusinessFinder() {
  const [apiKey, setApiKey] = useState('');
  const [location, setLocation] = useState('');
  const [radius, setRadius] = useState('1000');
  const [businessType, setBusinessType] = useState('');
  const [searching, setSearching] = useState(false);
  const [allBusinesses, setAllBusinesses] = useState([]);
  const [resultsVisible, setResultsVisible] = useState(false);
  const [filterName, setFilterName] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterHasPhone, setFilterHasPhone] = useState('');
  const [sortKey, setSortKey] = useState('name');
  const [sortDir, setSortDir] = useState(1);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState({
    message: 'Ready — enter a location and search',
    type: '',
    spinner: false,
  });
  const activeSearchRef = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem(PLACES_API_KEY_STORAGE);
    if (saved) setApiKey(saved);
  }, []);

  useEffect(
    () => () => {
      if (activeSearchRef.current) {
        activeSearchRef.current.abort();
      }
    },
    []
  );

  const setStatusBar = useCallback((message, type = '', spinner = false) => {
    setStatus({ message, type, spinner });
  }, []);

  const typeOptions = useMemo(() => {
    const types = [...new Set(allBusinesses.map((b) => b.type).filter(Boolean))].sort();
    return types;
  }, [allBusinesses]);

  const filtered = useMemo(() => {
    const name = filterName.toLowerCase();
    return allBusinesses.filter((b) => {
      if (name && !b.name.toLowerCase().includes(name)) return false;
      if (filterType && b.type !== filterType) return false;
      if (filterHasPhone === 'yes' && !b.phone) return false;
      if (filterHasPhone === 'no' && b.phone) return false;
      return true;
    });
  }, [allBusinesses, filterName, filterType, filterHasPhone]);

  const filteredNote =
    filtered.length < allBusinesses.length ? ` (showing ${filtered.length})` : '';

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      const av = a[sortKey] ?? '';
      const bv = b[sortKey] ?? '';
      if (av < bv) return -sortDir;
      if (av > bv) return sortDir;
      return 0;
    });
  }, [filtered, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / PER_PAGE));

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const pageSlice = useMemo(() => {
    const start = (page - 1) * PER_PAGE;
    return sorted.slice(start, start + PER_PAGE);
  }, [sorted, page]);

  useEffect(() => {
    setPage(1);
  }, [filterName, filterType, filterHasPhone]);

  const saveKey = useCallback(() => {
    const k = apiKey.trim();
    if (k) {
      localStorage.setItem(PLACES_API_KEY_STORAGE, k);
      setStatusBar('API key saved', 'success', false);
      return;
    }
    localStorage.removeItem(PLACES_API_KEY_STORAGE);
    setStatusBar('Stored API key removed', 'success', false);
  }, [apiKey, setStatusBar]);

  const handleSort = (key) => {
    if (sortKey === key) setSortDir((d) => -d);
    else {
      setSortKey(key);
      setSortDir(1);
    }
  };

  const clearFilters = useCallback(() => {
    setFilterName('');
    setFilterType('');
    setFilterHasPhone('');
  }, []);

  const cancelSearch = useCallback(() => {
    if (activeSearchRef.current) {
      activeSearchRef.current.abort();
      activeSearchRef.current = null;
      setSearching(false);
      setStatusBar('Search cancelled', 'error', false);
    }
  }, [setStatusBar]);

  const startSearch = async () => {
    const key = apiKey.trim();
    const effectiveKey = key || MAPS_BROWSER_KEY;
    const loc = location.trim();
    const normalizedRadius = String(Math.max(100, Math.min(50000, Number.parseInt(radius, 10) || 1000)));

    if (!MAPS_DEV_PROXY && !effectiveKey) {
      setStatusBar('Missing API key. Add one or set VITE_GOOGLE_MAPS_API_KEY for production.', 'error', false);
      return;
    }
    if (!loc) {
      setStatusBar('Please enter a location', 'error', false);
      return;
    }

    setRadius(normalizedRadius);

    if (activeSearchRef.current) {
      activeSearchRef.current.abort();
    }
    const controller = new AbortController();
    activeSearchRef.current = controller;

    setSearching(true);
    setResultsVisible(false);
    setAllBusinesses([]);

    try {
      const normLoc = normalizeLocationQuery(loc);
      const searchCacheKey = `${normLoc}|${normalizedRadius}|${businessType}`;
      let sessionCache = loadSessionCache();

      const cachedSearch = sessionCache.search[searchCacheKey];
      if (
        cachedSearch &&
        cacheEntryFresh(cachedSearch.t) &&
        Array.isArray(cachedSearch.businesses)
      ) {
        if (key) localStorage.setItem(PLACES_API_KEY_STORAGE, key);
        setAllBusinesses(cachedSearch.businesses);
        setFilterName('');
        setFilterType('');
        setFilterHasPhone('');
        setSortKey('name');
        setSortDir(1);
        setPage(1);
        setStatusBar(
          `Loaded ${cachedSearch.businesses.length} from cache (no API calls) — fresh for ${Math.round(CACHE_TTL_MS / 60000)} min`,
          'success',
          false
        );
        setResultsVisible(true);
        return;
      }

      let coords;
      const cachedGeo = sessionCache.geo[normLoc];
      if (cachedGeo && cacheEntryFresh(cachedGeo.t)) {
        setStatusBar('Using cached coordinates…', 'loading', true);
        coords = { lat: cachedGeo.lat, lng: cachedGeo.lng };
      } else {
        setStatusBar('Geocoding location…', 'loading', true);
        coords = await geocode(loc, effectiveKey, controller.signal);
        sessionCache = loadSessionCache();
        sessionCache.geo[normLoc] = { lat: coords.lat, lng: coords.lng, t: Date.now() };
        saveSessionCache(sessionCache);
      }

      setStatusBar(`Searching businesses within ${normalizedRadius}m…`, 'loading', true);
      const places = await nearbySearch(
        coords.lat,
        coords.lng,
        normalizedRadius,
        businessType,
        effectiveKey,
        (msg) => {
          setStatusBar(msg, 'loading', true);
        },
        controller.signal
      );

      if (!places.length) {
        sessionCache = loadSessionCache();
        sessionCache.search[searchCacheKey] = { businesses: [], t: Date.now() };
        saveSessionCache(sessionCache);
        setStatusBar('No businesses found for this location and radius', '', false);
        return;
      }

      setStatusBar(`Fetching details for ${places.length} businesses…`, 'loading', true);

      const BATCH = 5;
      const merged = [];
      for (let i = 0; i < places.length; i += BATCH) {
        const batch = places.slice(i, i + BATCH);
        const details = await Promise.all(batch.map((p) => getDetails(p.place_id, effectiveKey, controller.signal)));
        batch.forEach((p, idx) => {
          merged.push({
            name: p.name || '',
            type: (p.types || []).filter((t) => t !== 'point_of_interest' && t !== 'establishment')[0] || '',
            rating: p.rating || '',
            user_ratings_total: p.user_ratings_total || 0,
            phone: details[idx].formatted_phone_number || '',
            website: normalizeWebsiteUrl(details[idx].website),
            address: p.vicinity || '',
            status: p.business_status || '',
            place_id: p.place_id,
          });
        });
        setStatusBar(`Fetched ${Math.min(i + BATCH, places.length)} / ${places.length}…`, 'loading', true);
      }

      sessionCache = loadSessionCache();
      sessionCache.search[searchCacheKey] = { businesses: merged, t: Date.now() };
      saveSessionCache(sessionCache);

      if (key) localStorage.setItem(PLACES_API_KEY_STORAGE, key);
      setAllBusinesses(merged);
      setFilterName('');
      setFilterType('');
      setFilterHasPhone('');
      setSortKey('name');
      setSortDir(1);
      setPage(1);
      setStatusBar(`Done — ${merged.length} businesses loaded`, 'success', false);
      setResultsVisible(true);
    } catch (e) {
      if (e?.name === 'AbortError') {
        setStatusBar('Search cancelled', 'error', false);
        return;
      }
      setStatusBar(`Error: ${e.message}`, 'error', false);
    } finally {
      if (activeSearchRef.current === controller) {
        activeSearchRef.current = null;
      }
      setSearching(false);
    }
  };

  const exportCSV = () => {
    const headers = ['Name', 'Type', 'Rating', 'Reviews', 'Phone', 'Website', 'Address', 'Status'];
    const rows = filtered.map((b) =>
      [b.name, formatType(b.type), b.rating, b.user_ratings_total, b.phone, b.website, b.address, b.status].map(
        (v) => `"${String(v ?? '').replace(/"/g, '""')}"`
      )
    );
    const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    downloadBlob('businesses.csv', csv, 'text/csv');
  };

  const exportJSON = () => {
    downloadBlob('businesses.json', JSON.stringify(filtered, null, 2), 'application/json');
  };

  const goPage = (p) => {
    setPage(p);
    if (typeof window !== 'undefined') {
      window.scrollTo(0, 0);
    }
  };

  const statusClass =
    status.type === 'loading'
      ? 'bf-loading'
      : status.type === 'success'
        ? 'bf-success'
        : status.type === 'error'
          ? 'bf-error'
          : '';

  return (
    <div className="business-finder">
      <div className="business-finder__inner">
        <header>
          <div className="bf-tag">Local Intelligence Tool</div>
          <h1 className="bf-title">
            RADIUS
            <br />
            <span>BUSINESS</span> FINDER
          </h1>
          <p className="bf-subtitle">
            Choose a place type before search · Query any location · Export and refine results
          </p>
        </header>

        <form
          className="bf-config-panel"
          onSubmit={(event) => {
            event.preventDefault();
            startSearch();
          }}
        >
          {MAPS_DEV_PROXY && (
            <p className="bf-dev-banner">
              Dev server is using <code>GOOGLE_MAPS_API_KEY</code> from <code>.env.local</code> (proxied). You can search without pasting a key. Production builds still need a browser key below.
            </p>
          )}
          {!MAPS_DEV_PROXY && !apiKey.trim() && MAPS_BROWSER_KEY && (
            <p className="bf-key-banner">
              Using build-time key from <code>VITE_GOOGLE_MAPS_API_KEY</code>. Paste a key above if you want to
              override it in this browser.
            </p>
          )}
          <div className="bf-field">
            <label htmlFor="bf-api-key">
              Google Maps API key{MAPS_DEV_PROXY ? ' (optional in dev)' : ''}
            </label>
            <div className="bf-api-input-wrap">
              <input
                id="bf-api-key"
                type="text"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder={MAPS_DEV_PROXY ? 'Optional — dev uses .env; paste to save for production' : 'AIza...'}
                autoComplete="off"
              />
              <button type="button" className="bf-btn-secondary" onClick={saveKey}>
                Save
              </button>
            </div>
            <details className="bf-help">
              <summary>If you see REQUEST_DENIED</summary>
              <ul>
                <li>
                  In Google Cloud Console, enable <strong>Geocoding API</strong>, <strong>Places API</strong>, and billing for the project.
                </li>
                <li>
                  Under <strong>APIs and Services → Credentials</strong>, edit your key: <strong>API restrictions</strong> must allow those APIs (or don’t restrict while testing).
                </li>
                <li>
                  For requests from the browser, <strong>Application restrictions → HTTP referrers</strong> must include your origin, e.g.{' '}
                  <code>http://localhost:5173/*</code> for Vite and your live site URL for production.
                </li>
                <li>
                  <strong>Local dev without referrer hassle:</strong> add <code>GOOGLE_MAPS_API_KEY=your_key</code> to <code>.env.local</code> and restart{' '}
                  <code>npm run dev</code> — the dev server proxies Google requests and appends the key server-side. Use a key that is <strong>not</strong> limited to HTTP referrers (or use IP restrictions), because proxied requests do not send your browser referrer.
                </li>
              </ul>
            </details>
          </div>

          <p className="bf-search-criteria-label">Search criteria</p>
          <div className="bf-grid-3">
            <div className="bf-field">
              <label htmlFor="bf-business-type">Business type (before search)</label>
              <select
                id="bf-business-type"
                value={businessType}
                onChange={(e) => setBusinessType(e.target.value)}
                aria-describedby="bf-business-type-hint"
              >
                {BUSINESS_TYPES.map((opt) => (
                  <option key={opt.value || 'all'} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <p id="bf-business-type-hint" className="bf-field-hint">
                Limits the Google Places nearby search. Use &ldquo;All types&rdquo; for every establishment in the
                radius.
              </p>
            </div>
            <div className="bf-field">
              <label htmlFor="bf-location">Location (address or coords)</label>
              <input
                id="bf-location"
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Sandton, Johannesburg"
                autoComplete="off"
              />
            </div>
            <div className="bf-field">
              <label htmlFor="bf-radius">Radius (meters)</label>
              <input
                id="bf-radius"
                type="number"
                value={radius}
                onChange={(e) => setRadius(e.target.value)}
                min={100}
                max={50000}
              />
            </div>
          </div>

          <div className="bf-actions-row">
            <button type="submit" className="bf-btn-primary" disabled={searching}>
              <span>{searching ? 'Searching…' : 'Search Businesses'}</span>
            </button>
            {searching && (
              <button type="button" className="bf-btn-secondary" onClick={cancelSearch}>
                Cancel
              </button>
            )}
          </div>

          <div className={`bf-status-bar ${statusClass}`}>
            {status.spinner && <div className="bf-spinner" aria-hidden />}
            <span>{status.message}</span>
          </div>
        </form>

        <div className={`bf-results-section ${resultsVisible ? '' : 'bf-hidden'}`}>
          <div className="bf-results-header">
            <div className="bf-results-count">
              Found <span className="bf-accent-num">{allBusinesses.length}</span> businesses
              <span className="bf-filtered-note">{filteredNote}</span>
            </div>
            <div className="bf-export-row">
              <button type="button" className="bf-btn-export" onClick={exportCSV} disabled={!filtered.length}>
                Export CSV
              </button>
              <button type="button" className="bf-btn-export bf-btn-export--json" onClick={exportJSON} disabled={!filtered.length}>
                Export JSON
              </button>
            </div>
          </div>

          <div className="bf-filters-bar">
            <span className="bf-filters-bar-label">Refine results</span>
            <input
              type="text"
              className="bf-filter-input"
              placeholder="Filter by name..."
              value={filterName}
              onChange={(e) => setFilterName(e.target.value)}
            />
            <select
              className="bf-filter-select"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              aria-label="Filter table rows by returned place type"
            >
              <option value="">All returned types</option>
              {typeOptions.map((t) => (
                <option key={t} value={t}>
                  {formatType(t)}
                </option>
              ))}
            </select>
            <select
              className="bf-filter-select"
              value={filterHasPhone}
              onChange={(e) => setFilterHasPhone(e.target.value)}
            >
              <option value="">Any contact</option>
              <option value="yes">Has phone</option>
              <option value="no">No phone</option>
            </select>
            <button
              type="button"
              className="bf-btn-secondary"
              onClick={clearFilters}
              disabled={!filterName && !filterType && !filterHasPhone}
            >
              Clear filters
            </button>
          </div>

          <div className="bf-table-wrap">
            <table>
              <thead>
                <tr>
                  <SortHeader label="Name" sortKey="name" activeSortKey={sortKey} sortDir={sortDir} onSort={handleSort} />
                  <SortHeader label="Type" sortKey="type" activeSortKey={sortKey} sortDir={sortDir} onSort={handleSort} />
                  <SortHeader label="Rating" sortKey="rating" activeSortKey={sortKey} sortDir={sortDir} onSort={handleSort} />
                  <th>Phone</th>
                  <th>Website</th>
                  <th>Address</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {pageSlice.map((b) => (
                  <tr key={b.place_id}>
                    <td>
                      <strong>{b.name}</strong>
                    </td>
                    <td>
                      <span className="bf-badge">{formatType(b.type)}</span>
                    </td>
                    <td>
                      {b.rating ? (
                        <>
                          <span className="bf-rating">{b.rating}</span>{' '}
                          <span className="bf-rating-meta">({b.user_ratings_total})</span>
                        </>
                      ) : (
                        <span className="bf-no-data">—</span>
                      )}
                    </td>
                    <td>
                      {b.phone ? (
                        <a href={`tel:${b.phone}`} className="bf-link">
                          {b.phone}
                        </a>
                      ) : (
                        <span className="bf-no-data">—</span>
                      )}
                    </td>
                    <td>
                      {b.website ? (
                        <a href={b.website} target="_blank" rel="noopener noreferrer" className="bf-link" title={b.website}>
                          ↗ Visit
                        </a>
                      ) : (
                        <span className="bf-no-data">—</span>
                      )}
                    </td>
                    <td className="bf-address-cell">{b.address}</td>
                    <td>
                      <StatusBadge status={b.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Pagination page={page} totalPages={totalPages} total={sorted.length} onGoPage={goPage} />
        </div>
      </div>
    </div>
  );
}

function Pagination({ page, totalPages, total, onGoPage }) {
  if (totalPages <= 1) return null;

  const start = (page - 1) * PER_PAGE + 1;
  const end = Math.min(page * PER_PAGE, total);
  const buttons = [];

  for (let i = 1; i <= totalPages; i++) {
    if (i === page) {
      buttons.push(
        <button
          key={i}
          type="button"
          className="bf-btn-secondary"
          style={{ borderColor: 'var(--bf-accent)', color: 'var(--bf-accent)' }}
        >
          {i}
        </button>
      );
    } else if (Math.abs(i - page) <= 2 || i === 1 || i === totalPages) {
      buttons.push(
        <button key={i} type="button" className="bf-btn-secondary" onClick={() => onGoPage(i)}>
          {i}
        </button>
      );
    } else if (Math.abs(i - page) === 3) {
      buttons.push(
        <span key={`bf-ellipsis-${i}-${page}`} className="bf-page-ellipsis">
          …
        </span>
      );
    }
  }

  return (
    <div className="bf-pagination">
      <span className="bf-page-info">
        {start}–{end} of {total}
      </span>
      <button type="button" className="bf-btn-secondary" disabled={page === 1} onClick={() => onGoPage(page - 1)}>
        ← Prev
      </button>
      {buttons}
      <button
        type="button"
        className="bf-btn-secondary"
        disabled={page === totalPages}
        onClick={() => onGoPage(page + 1)}
      >
        Next →
      </button>
    </div>
  );
}

function SortHeader({ label, sortKey, activeSortKey, sortDir, onSort }) {
  const isActive = activeSortKey === sortKey;
  const arrow = !isActive ? '↕' : sortDir === 1 ? '↑' : '↓';
  const ariaSort = !isActive ? 'none' : sortDir === 1 ? 'ascending' : 'descending';
  return (
    <th className={isActive ? 'bf-sorted' : ''} aria-sort={ariaSort}>
      <button
        type="button"
        className="bf-sort-btn"
        onClick={() => onSort(sortKey)}
        aria-label={`Sort by ${label}${isActive ? (sortDir === 1 ? ' descending' : ' ascending') : ''}`}
      >
        <span>{label}</span>
        <span aria-hidden>{arrow}</span>
      </button>
    </th>
  );
}
