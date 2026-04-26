import React from 'react';
import LegalLayout from './LegalLayout';

export default function Privacy() {
  return (
    <LegalLayout
      eyebrow="Privacy Policy"
      title={<>Your data, <em style={{ fontStyle: 'italic', color: '#6B9E7F' }}>your control.</em></>}
      lastUpdated="26 April 2026"
    >
      <p>This Privacy Policy explains how GlowWise ("we", "our", "us") collects, uses, stores, and protects your personal data when you use our app, website, and services. We are committed to protecting your privacy in line with the UK General Data Protection Regulation (UK GDPR), the Data Protection Act 2018, and the EU GDPR where applicable.</p>

      <div className="info-box">
        <strong>The short version:</strong> We only collect what's needed to give you personalised wellness guidance. We never sell your data. You can access, correct, export, or delete your data at any time.
      </div>

      <h2>1. Who we are</h2>
      <p>GlowWise is an AI-powered wellness platform based in the United Kingdom. For privacy enquiries, contact us at <a href="mailto:privacy@glowwise.app">privacy@glowwise.app</a>.</p>

      <h2>2. Information we collect</h2>
      <p>We collect information you provide directly to us when you create an account and use GlowWise:</p>

      <h3>Account information</h3>
      <ul>
        <li>Email address (required to create your account)</li>
        <li>Password (encrypted and never visible to us)</li>
        <li>Name, age, and gender (provided during onboarding)</li>
      </ul>

      <h3>Wellness information</h3>
      <ul>
        <li>Your wellness priorities and goals</li>
        <li>Lifestyle information (sleep, stress, exercise, diet, hydration)</li>
        <li>Optional health context (symptoms, conditions, medications you choose to share)</li>
        <li>Daily check-in data (energy, sleep, stress, mood ratings)</li>
        <li>AI Coach conversations</li>
        <li>Optional photos you upload to track progress</li>
      </ul>

      <h3>Technical information</h3>
      <ul>
        <li>Device type, operating system, and browser</li>
        <li>IP address (for security and fraud prevention)</li>
        <li>Usage data (which features you use and when)</li>
      </ul>

      <h2>3. How we use your information</h2>
      <p>We use your data only for the following purposes:</p>
      <ul>
        <li><strong>To provide the service:</strong> generating personalised wellness guidance, tracking your patterns, and powering your AI Coach</li>
        <li><strong>To improve GlowWise:</strong> understanding how features are used, identifying bugs, and developing new features</li>
        <li><strong>To communicate with you:</strong> sending check-in reminders, weekly summaries, or service updates (only if you've opted in)</li>
        <li><strong>To keep you safe:</strong> detecting fraudulent activity and protecting your account</li>
        <li><strong>To meet legal obligations:</strong> complying with UK and EU law</li>
      </ul>

      <h2>4. Legal basis for processing</h2>
      <p>Under UK GDPR, we rely on the following lawful bases:</p>
      <ul>
        <li><strong>Consent:</strong> for processing health and wellness data, sending marketing emails, and using non-essential cookies</li>
        <li><strong>Contract:</strong> for providing the GlowWise service you've signed up for</li>
        <li><strong>Legitimate interest:</strong> for improving our service, security, and fraud prevention (always balanced against your rights)</li>
        <li><strong>Legal obligation:</strong> where we must retain data to meet UK or EU law</li>
      </ul>

      <h2>5. How we store and protect your data</h2>
      <p>Your data is stored on secure servers operated by trusted infrastructure providers (Google Firebase). All data is encrypted in transit (TLS) and at rest (AES-256). Passwords are hashed using industry-standard algorithms and are never visible to us.</p>
      <p>Data may be processed in the UK, EU, or other countries with adequate data protection standards. Where data is transferred outside the UK or EU, we use Standard Contractual Clauses or other approved safeguards.</p>

      <h2>6. Sharing your data</h2>
      <p><strong>We never sell your personal data. We never share your wellness data with advertisers.</strong></p>
      <p>We share data only with:</p>
      <ul>
        <li><strong>Infrastructure providers</strong> (Google Firebase for hosting and authentication, Vercel for the website) — these providers process data on our behalf under strict data processing agreements</li>
        <li><strong>AI service providers</strong> (such as OpenAI, when our AI Coach is active) — to generate responses to your questions. We minimise the data sent to only what's necessary</li>
        <li><strong>Payment processors</strong> (Stripe) — only billing information, never your wellness data</li>
        <li><strong>Authorities</strong> — only when legally required (e.g. court order or law enforcement request)</li>
      </ul>

      <h2>7. Your rights under UK GDPR</h2>
      <p>You have the following rights regarding your personal data:</p>
      <ul>
        <li><strong>Right to access:</strong> request a copy of all data we hold about you</li>
        <li><strong>Right to rectification:</strong> correct any inaccurate or incomplete information</li>
        <li><strong>Right to erasure ("right to be forgotten"):</strong> request deletion of your data</li>
        <li><strong>Right to restrict processing:</strong> limit how we use your data</li>
        <li><strong>Right to data portability:</strong> receive your data in a portable format (e.g. JSON or CSV)</li>
        <li><strong>Right to object:</strong> object to processing based on legitimate interest</li>
        <li><strong>Right to withdraw consent:</strong> revoke consent at any time</li>
        <li><strong>Right to lodge a complaint:</strong> with the UK Information Commissioner's Office (<a href="https://ico.org.uk" target="_blank" rel="noreferrer">ico.org.uk</a>)</li>
      </ul>
      <p>To exercise any of these rights, email us at <a href="mailto:privacy@glowwise.app">privacy@glowwise.app</a>. We will respond within one calendar month.</p>

      <h2>8. Data retention</h2>
      <p>We retain your data only as long as necessary:</p>
      <ul>
        <li><strong>While your account is active:</strong> we keep your data to provide the service</li>
        <li><strong>If you delete your account:</strong> all personal data is permanently deleted within 30 days, except where we are legally required to keep records (e.g. tax records, fraud prevention)</li>
        <li><strong>Inactive accounts:</strong> if your account remains unused for 24 months, we will email you and may delete it after a further 30 days</li>
      </ul>

      <h2>9. Children's privacy</h2>
      <p>GlowWise is not intended for anyone under 18. We do not knowingly collect data from minors. If we learn we have collected data from someone under 18, we will delete it immediately. Parents or guardians who believe their child has provided us data should contact <a href="mailto:privacy@glowwise.app">privacy@glowwise.app</a>.</p>

      <h2>10. Cookies and tracking</h2>
      <p>We use cookies and similar technologies to keep you logged in and improve your experience. See our <a href="/cookies">Cookie Policy</a> for full details.</p>

      <h2>11. Changes to this policy</h2>
      <p>We may update this Privacy Policy from time to time. If we make significant changes, we'll email you and update the "Last updated" date above. Continued use of GlowWise after changes means you accept the updated policy.</p>

      <h2>12. Contact us</h2>
      <p>For any privacy questions, data requests, or concerns, please email <a href="mailto:privacy@glowwise.app">privacy@glowwise.app</a>. We aim to resolve every issue directly with you and will respond within one calendar month.</p>
      <p>You also have the right to lodge a complaint with a supervisory authority. In the UK, this is the Information Commissioner's Office (<a href="https://ico.org.uk" target="_blank" rel="noreferrer">ico.org.uk</a>). We'd ask that you contact us first so we can address any concerns directly.</p>
    </LegalLayout>
  );
}
