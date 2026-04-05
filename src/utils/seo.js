/**
 * SEO Utilities for Merdova
 * Simple utility functions to manage document head meta tags dynamically
 */

const defaultSEO = {
  title: 'Merdova | AI Solutions — Implement & Integrate AI For Your Business',
  description: 'Merdova helps businesses implement and integrate AI to drive real outcomes. AI-powered web platforms, smart mobile solutions, cloud infrastructure, AI-driven marketing, and strategic consulting — all backed by transparent SLAs.',
  url: 'https://merdova.com/',
  image: 'https://merdova.com/og-image.png',
};

/**
 * Update page title
 * @param {string} title - The page title
 */
export const setPageTitle = (title) => {
  document.title = title || defaultSEO.title;
};

/**
 * Update meta description
 * @param {string} description - The page description
 */
export const setMetaDescription = (description) => {
  const desc = description || defaultSEO.description;
  
  // Update standard meta description
  let metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) {
    metaDesc.setAttribute('content', desc);
  }
  
  // Update OG description
  let ogDesc = document.querySelector('meta[property="og:description"]');
  if (ogDesc) {
    ogDesc.setAttribute('content', desc);
  }
  
  // Update Twitter description
  let twitterDesc = document.querySelector('meta[name="twitter:description"]');
  if (twitterDesc) {
    twitterDesc.setAttribute('content', desc);
  }
};

/**
 * Update canonical URL
 * @param {string} url - The canonical URL
 */
export const setCanonicalUrl = (url) => {
  const canonicalUrl = url || defaultSEO.url;
  
  let canonical = document.querySelector('link[rel="canonical"]');
  if (canonical) {
    canonical.setAttribute('href', canonicalUrl);
  }
  
  let ogUrl = document.querySelector('meta[property="og:url"]');
  if (ogUrl) {
    ogUrl.setAttribute('content', canonicalUrl);
  }
};

/**
 * Set page as non-indexable (useful for private pages)
 */
export const setNoIndex = () => {
  let robots = document.querySelector('meta[name="robots"]');
  if (robots) {
    robots.setAttribute('content', 'noindex, nofollow');
  }
};

/**
 * Reset to default indexable state
 */
export const setIndex = () => {
  let robots = document.querySelector('meta[name="robots"]');
  if (robots) {
    robots.setAttribute('content', 'index, follow');
  }
};

/**
 * Update all SEO meta tags at once
 * @param {Object} seo - SEO configuration object
 * @param {string} seo.title - Page title
 * @param {string} seo.description - Page description
 * @param {string} seo.url - Canonical URL
 * @param {boolean} seo.noIndex - Whether to prevent indexing
 */
export const updateSEO = ({ title, description, url, noIndex = false }) => {
  setPageTitle(title);
  setMetaDescription(description);
  setCanonicalUrl(url);
  
  if (noIndex) {
    setNoIndex();
  } else {
    setIndex();
  }
};

/**
 * Reset all SEO tags to defaults
 */
export const resetSEO = () => {
  updateSEO({
    title: defaultSEO.title,
    description: defaultSEO.description,
    url: defaultSEO.url,
    noIndex: false,
  });
};

export default {
  setPageTitle,
  setMetaDescription,
  setCanonicalUrl,
  setNoIndex,
  setIndex,
  updateSEO,
  resetSEO,
};
