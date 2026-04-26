import React from 'react';
import LegalLayout from './LegalLayout';
import { Mail, Clock, MapPin } from 'lucide-react';

export default function Contact() {
  return (
    <LegalLayout eyebrow="Get in touch" title={<>We'd love to <em style={{ fontStyle: 'italic', color: '#6B9E7F' }}>hear from you.</em></>}>
      <p>Whether you have a question about your account, feedback on the app, a privacy request, or just want to say hello — we read every message.</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginTop: '32px', marginBottom: '32px' }}>
        <div style={{ background: '#FAF8F5', border: '1px solid rgba(168, 153, 104, 0.15)', borderRadius: '12px', padding: '24px' }}>
          <Mail size={20} strokeWidth={1.6} style={{ color: '#6B9E7F', marginBottom: '12px' }} />
          <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: '18px', fontWeight: 500, color: '#3D4A52', marginBottom: '8px' }}>General support</h3>
          <a href="mailto:support@glowwise.app" style={{ color: '#6B9E7F', fontWeight: 500, fontSize: '14px' }}>support@glowwise.app</a>
        </div>

        <div style={{ background: '#FAF8F5', border: '1px solid rgba(168, 153, 104, 0.15)', borderRadius: '12px', padding: '24px' }}>
          <Mail size={20} strokeWidth={1.6} style={{ color: '#6B9E7F', marginBottom: '12px' }} />
          <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: '18px', fontWeight: 500, color: '#3D4A52', marginBottom: '8px' }}>Privacy &amp; data requests</h3>
          <a href="mailto:privacy@glowwise.app" style={{ color: '#6B9E7F', fontWeight: 500, fontSize: '14px' }}>privacy@glowwise.app</a>
        </div>

        <div style={{ background: '#FAF8F5', border: '1px solid rgba(168, 153, 104, 0.15)', borderRadius: '12px', padding: '24px' }}>
          <Clock size={20} strokeWidth={1.6} style={{ color: '#6B9E7F', marginBottom: '12px' }} />
          <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: '18px', fontWeight: 500, color: '#3D4A52', marginBottom: '8px' }}>Response time</h3>
          <p style={{ fontSize: '14px', color: '#5A6770', marginBottom: 0 }}>Within 24–72 hours, Monday to Friday.</p>
        </div>

        <div style={{ background: '#FAF8F5', border: '1px solid rgba(168, 153, 104, 0.15)', borderRadius: '12px', padding: '24px' }}>
          <MapPin size={20} strokeWidth={1.6} style={{ color: '#6B9E7F', marginBottom: '12px' }} />
          <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: '18px', fontWeight: 500, color: '#3D4A52', marginBottom: '8px' }}>Based in</h3>
          <p style={{ fontSize: '14px', color: '#5A6770', marginBottom: 0 }}>United Kingdom</p>
        </div>
      </div>

      <h2>Before you write</h2>
      <p>If you're experiencing a medical emergency, please contact your local emergency services. GlowWise cannot provide urgent medical assistance.</p>
      <p>For account or technical issues, please include your registered email address so we can help you faster.</p>

      <div className="info-box">
        <strong>A note on response times:</strong> GlowWise is built and maintained by a small team. We genuinely read every message and reply personally — please be patient with us during busy periods.
      </div>
    </LegalLayout>
  );
}
