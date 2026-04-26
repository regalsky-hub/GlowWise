import React from 'react';
import LegalLayout from './LegalLayout';

export default function Terms() {
  return (
    <LegalLayout
      eyebrow="Terms of Service"
      title={<>The <em style={{ fontStyle: 'italic', color: '#6B9E7F' }}>fine print</em>, kept clear.</>}
      lastUpdated="26 April 2026"
    >
      <p>These Terms of Service ("Terms") govern your use of GlowWise. By creating an account or using the app, you agree to these Terms. Please read them carefully. If you do not agree, please do not use GlowWise.</p>

      <div className="info-box">
        <strong>The short version:</strong> GlowWise gives you AI-powered wellness guidance — not medical advice. You must be 18+ to use it. We charge £4.99/month if you upgrade. You can cancel anytime. We are not liable for health decisions you make based on the app.
      </div>

      <h2>1. Acceptance of Terms</h2>
      <p>By accessing or using GlowWise, you confirm that you have read, understood, and agree to be bound by these Terms and our <a href="/privacy">Privacy Policy</a>, <a href="/cookies">Cookie Policy</a>, and <a href="/disclaimer">Medical Disclaimer</a>.</p>

      <h2>2. Eligibility</h2>
      <p>You must be at least 18 years old to use GlowWise. By using the app, you confirm that you are 18 or over and legally capable of entering into a binding contract under the laws of the United Kingdom.</p>

      <h2>3. What GlowWise is — and isn't</h2>
      <p>GlowWise provides AI-generated wellness guidance, including suggestions on lifestyle, nutrition, sleep, stress, and supplements. The information is for general informational and educational purposes only.</p>
      <p><strong>GlowWise is not:</strong></p>
      <ul>
        <li>A medical service, healthcare provider, or licensed clinic</li>
        <li>A substitute for advice from a qualified doctor, pharmacist, dietitian, or therapist</li>
        <li>A diagnostic, treatment, or emergency service</li>
        <li>A replacement for prescribed medication or therapy</li>
      </ul>
      <p>See our <a href="/disclaimer">Medical Disclaimer</a> for full details.</p>

      <h2>4. Your account</h2>
      <p>You are responsible for:</p>
      <ul>
        <li>Keeping your account credentials confidential</li>
        <li>All activity that takes place under your account</li>
        <li>Notifying us immediately if you suspect unauthorised access at <a href="mailto:support@glowwise.app">support@glowwise.app</a></li>
        <li>Providing accurate information during onboarding</li>
      </ul>
      <p>You may have only one personal account. Sharing accounts is not permitted.</p>

      <h2>5. Subscription and payment</h2>
      <h3>Free tier</h3>
      <p>The free tier of GlowWise allows up to 2 AI Coach questions per day, daily wellness check-ins, and basic pattern insights — at no cost.</p>

      <h3>Paid subscription</h3>
      <p>The paid Wellness Coach subscription is £4.99 per month (or local equivalent), billed monthly in advance. Paid features include extended AI Coach access (subject to a fair-use cap of 50 questions per day), advanced pattern insights, photo progression tracking, and weekly wellness summaries.</p>

      <h3>Fair-use cap</h3>
      <p>To prevent abuse and keep the service sustainable, paid users are limited to a maximum of 50 AI Coach questions per day. Users who repeatedly attempt to exceed this cap may have their account temporarily suspended.</p>

      <h3>Billing and renewal</h3>
      <p>Payment is processed by Stripe. Subscriptions auto-renew monthly until cancelled. You can cancel anytime in Settings — cancellation takes effect at the end of your current billing period, and you keep paid access until then.</p>

      <h3>Refunds</h3>
      <p>Under UK consumer law, you have a 14-day right to cancel and receive a full refund from the date of your first subscription. To request a refund, email <a href="mailto:support@glowwise.app">support@glowwise.app</a>. After 14 days, refunds are at our discretion and only granted in exceptional circumstances.</p>

      <h2>6. User responsibilities</h2>
      <p>By using GlowWise, you agree:</p>
      <ul>
        <li>You are solely responsible for your own health decisions</li>
        <li>You will not rely solely on GlowWise for medical or health choices</li>
        <li>You will consult a qualified healthcare provider before making significant lifestyle, dietary, or supplement changes — especially if you are pregnant, breastfeeding, taking medication, or have a medical condition</li>
        <li>You will not misuse the app or attempt to harm other users, the service, or third parties</li>
        <li>You will not use GlowWise for any unlawful, harmful, or fraudulent purpose</li>
      </ul>

      <h2>7. Acceptable use</h2>
      <p>You agree not to:</p>
      <ul>
        <li>Use GlowWise to harass, abuse, or harm others</li>
        <li>Attempt to access other users' accounts or data</li>
        <li>Reverse-engineer, scrape, or copy any part of the service</li>
        <li>Upload malicious content, viruses, or harmful code</li>
        <li>Impersonate any person or misrepresent your affiliation</li>
        <li>Use automated tools (bots, scrapers) to access the service without our written permission</li>
      </ul>
      <p>Violation may result in immediate account suspension or termination.</p>

      <h2>8. Intellectual property</h2>
      <p>All content, design, branding, code, and features of GlowWise are owned by us or our licensors and are protected by copyright, trademark, and other intellectual property laws. You retain ownership of content you submit (such as your wellness data and photos), but grant us a limited licence to process it solely to provide the service to you.</p>

      <h2>9. Privacy</h2>
      <p>Your use of GlowWise is also governed by our <a href="/privacy">Privacy Policy</a>, which explains how we collect, use, and protect your personal data.</p>

      <h2>10. Limitation of liability</h2>
      <p>To the fullest extent permitted by law:</p>
      <ul>
        <li>GlowWise is provided "as is" and "as available" without warranties of any kind</li>
        <li>We do not guarantee the accuracy, completeness, or reliability of any content or recommendations</li>
        <li>We are not liable for any direct, indirect, incidental, consequential, or special damages arising from your use of the app, including health outcomes, lost profits, or data loss</li>
        <li>Our total liability to you in any 12-month period will not exceed the amount you paid us during that period (or £50 if you are a free-tier user)</li>
      </ul>
      <p>Nothing in these Terms limits liability for death, personal injury caused by negligence, fraud, or any other liability that cannot be lawfully excluded under UK law.</p>

      <h2>11. Termination</h2>
      <p>You may close your account at any time via Settings. We may suspend or terminate your access if you breach these Terms, misuse the service, or for legal or safety reasons.</p>
      <p>On termination, your right to use GlowWise ends immediately. Your data will be handled in accordance with our <a href="/privacy">Privacy Policy</a>.</p>

      <h2>12. Changes to these Terms</h2>
      <p>We may update these Terms from time to time. If we make material changes, we will notify you by email or in-app message at least 14 days before they take effect. Continued use of GlowWise after changes means you accept the updated Terms.</p>

      <h2>13. Governing law and disputes</h2>
      <p>These Terms are governed by the laws of England and Wales. Any dispute arising from your use of GlowWise will be subject to the exclusive jurisdiction of the courts of England and Wales — except where you are a consumer entitled to bring proceedings in your country of residence under applicable law.</p>

      <h2>14. Contact</h2>
      <p>For questions about these Terms, email <a href="mailto:support@glowwise.app">support@glowwise.app</a>.</p>
    </LegalLayout>
  );
}
