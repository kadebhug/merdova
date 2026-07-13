import React, { useEffect } from 'react';
import './PrivacyPolicy.css';

export default function PrivacyPolicy() {
  useEffect(() => {
    document.title = 'Privacy Policy — Sojourn';
    return () => { document.title = ''; };
  }, []);

  return (
    <div className="privacy-policy">
      <h1>Privacy Policy</h1>
      <p className="updated">Last updated: March 2025</p>

      <p>Sojourn ("the app") is a personal life visualization and habit-tracking app. This privacy policy explains how we handle your data.</p>

      <h2>1. Data We Collect</h2>
      <p>All data you create in the app stays under your control:</p>
      <ul>
        <li><strong>Birth date and life expectancy</strong> — Used to calculate your life grid and weeks lived.</li>
        <li><strong>Habits</strong> — Names, emoji, categories, completion history, and streak data.</li>
        <li><strong>Journal entries</strong> — Mood, energy, notes, tags, and optional photos.</li>
        <li><strong>Goals and bucket list</strong> — Titles, descriptions, dates, and completion status.</li>
        <li><strong>Time capsules</strong> — Letters to your future self, photos, and voice memos.</li>
        <li><strong>Accountability partner</strong> — Display name and shared challenge data.</li>
      </ul>

      <h2>2. Microphone Access (Voice Memos)</h2>
      <p>The app requests microphone permission to record voice memos for time capsules. Voice recordings:</p>
      <ul>
        <li>Are stored locally on your device.</li>
        <li>Are used only when you choose to add a voice memo to a time capsule.</li>
        <li>Are not shared with third parties.</li>
        <li>When cloud sync is enabled, metadata (including references to voice memos) may be synced; the actual audio files remain on your device.</li>
      </ul>

      <h2>3. Storage and Sync</h2>
      <p><strong>Local storage:</strong> All data is stored on your device first. You can use the app fully offline.</p>
      <p><strong>Cloud sync (optional):</strong> When you enable sync, data is stored in Supabase (hosted infrastructure). Sync uses Supabase's authentication and row-level security so only you can access your data.</p>
      <p><strong>Journal encryption:</strong> You can enable end-to-end encryption for journal notes. When enabled, notes are encrypted on your device before sync; the encryption key stays on your device only.</p>

      <h2>4. Third-Party Services</h2>
      <ul>
        <li><strong>Supabase</strong> — Cloud database and auth when sync is enabled. See <a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer">Supabase Privacy</a>.</li>
        <li><strong>Daily quote API</strong> — Fetches quotes; no personal data is sent.</li>
      </ul>

      <h2>5. Data We Do Not Sell</h2>
      <p>We do not sell, rent, or share your personal data with advertisers or third parties for marketing.</p>

      <h2>6. Data Deletion</h2>
      <p>You can delete all your data at any time via Settings → Sync & Data → Delete my data. This removes local data and, when sync is enabled, your cloud account and associated data.</p>

      <h2>7. Notifications</h2>
      <p>The app may send local notifications (daily quote, habit reminders, time capsule unlock). These are scheduled on your device and do not involve external servers beyond the quote fetch.</p>

      <h2>8. Changes</h2>
      <p>We may update this policy. The "Last updated" date at the top will reflect changes. Continued use of the app after updates means you accept the revised policy.</p>

      <h2>9. Contact</h2>
      <p>For questions about this privacy policy, contact us through your app store listing or the developer contact provided there.</p>
    </div>
  );
}
