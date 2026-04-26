import React from 'react';
import LegalLayout from './LegalLayout';

export default function Cookies() {
  return (
    <LegalLayout
      eyebrow="Cookie Policy"
      title={<>About <em style={{ fontStyle: 'italic', color: '#6B9E7F' }}>cookies.</em></>}
      lastUpdated="26 April 2026"
    >
      <p>This Cookie Policy explains what cookies are, how GlowWise uses them, and how you can control them. By using our website or app, you agree to our use of essential cookies. You can opt out of non-essential cookies at any time.</p>

      <h2>1. What are cookies?</h2>
      <p>Cookies are small text files placed on your device when you visit a website or use an app. They help the site remember your preferences, keep you logged in, and understand how the service is used.</p>

      <h2>2. Types of cookies we use</h2>

      <h3>Strictly necessary cookies</h3>
      <p>These cookies are essential for GlowWise to function. They cannot be disabled without breaking the service.</p>
      <ul>
        <li><strong>Authentication:</strong> keeps you logged into your account</li>
        <li><strong>Security:</strong> protects against fraud and unauthorised access</li>
        <li><strong>Session management:</strong> remembers your activity within a single visit</li>
      </ul>

      <h3>Functional cookies</h3>
      <p>These cookies remember your preferences to give you a better experience.</p>
      <ul>
        <li>Language and regional settings</li>
        <li>Notification preferences</li>
        <li>Display preferences (e.g. dark mode, if available)</li>
      </ul>

      <h3>Analytics cookies (with consent)</h3>
      <p>These cookies help us understand how GlowWise is used so we can improve it. They collect aggregated, anonymised data — they do not identify you personally.</p>
      <ul>
        <li>Pages visited and features used</li>
        <li>Time spent on the app</li>
        <li>Performance metrics (e.g. loading speed, errors)</li>
      </ul>
      <p>We use Google Analytics 4 and Microsoft Clarity for analytics. You can opt out at any time using the cookie banner or your browser settings.</p>

      <h3>Marketing cookies</h3>
      <p>We do not currently use marketing or advertising cookies. We will update this policy and ask for fresh consent if we ever introduce them.</p>

      <h2>3. Third-party cookies</h2>
      <p>Some cookies are set by trusted third parties who provide services on our behalf:</p>
      <ul>
        <li><strong>Google Firebase</strong> — for authentication and data storage</li>
        <li><strong>Stripe</strong> — for processing subscription payments</li>
        <li><strong>Google Analytics</strong> — for usage analytics (with consent)</li>
        <li><strong>Microsoft Clarity</strong> — for understanding user behaviour (with consent)</li>
      </ul>
      <p>These providers have their own privacy and cookie policies, which we encourage you to review.</p>

      <h2>4. How to manage cookies</h2>
      <p>You have several options for controlling cookies:</p>

      <h3>Cookie banner</h3>
      <p>When you first visit GlowWise, you'll see a cookie banner where you can accept or decline non-essential cookies. You can change your choice at any time by clicking the cookie preferences link in our footer.</p>

      <h3>Browser settings</h3>
      <p>You can also control cookies through your browser settings. Most browsers let you block, delete, or be notified of cookies. Here's how for the most common browsers:</p>
      <ul>
        <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noreferrer">Google Chrome</a></li>
        <li><a href="https://support.mozilla.org/en-US/kb/clear-cookies-and-site-data-firefox" target="_blank" rel="noreferrer">Mozilla Firefox</a></li>
        <li><a href="https://support.apple.com/en-gb/guide/safari/sfri11471/mac" target="_blank" rel="noreferrer">Safari</a></li>
        <li><a href="https://support.microsoft.com/en-us/microsoft-edge" target="_blank" rel="noreferrer">Microsoft Edge</a></li>
      </ul>

      <div className="info-box">
        <strong>Note:</strong> Blocking strictly necessary cookies may prevent core features (like staying logged in) from working. Blocking analytics cookies will not affect your experience.
      </div>

      <h2>5. Do Not Track</h2>
      <p>Some browsers offer a "Do Not Track" (DNT) signal. GlowWise honours DNT signals — if your browser is set to DNT, we will not load analytics cookies, even if you have not changed your cookie preferences.</p>

      <h2>6. Changes to this policy</h2>
      <p>We may update this Cookie Policy occasionally. The "Last updated" date at the top reflects the latest version. Significant changes will be communicated via email or in-app notice.</p>

      <h2>7. Contact</h2>
      <p>If you have questions about cookies or our use of them, email <a href="mailto:privacy@glowwise.app">privacy@glowwise.app</a>.</p>
    </LegalLayout>
  );
}
