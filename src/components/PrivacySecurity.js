import React from 'react';
import './PrivacySecurity.css'; // CSS file for styling

const PrivacySecurity = () => {
  return (
    <div className="privacy-security-container">
      <h1>Privacy & Security</h1>
      <p>
        Your privacy is important to us. We are committed to protecting your personal data and ensuring that your experience with our weather app is safe and secure.
      </p>
      
      <section>
        <h2>Data Collection</h2>
        <p>
          We collect minimal personal information, including your location data, to provide accurate weather updates. This information is stored securely and never shared with third parties without your consent.
        </p>
      </section>
      
      <section>
        <h2>Data Usage</h2>
        <p>
          Your data is used solely for improving the functionality of our app and enhancing your user experience. We do not sell or share your data with advertisers.
        </p>
      </section>
      
      <section>
        <h2>Security Measures</h2>
        <p>
          We use industry-standard encryption to protect your data and ensure that your information is secure at all times.
        </p>
      </section>

      <section>
        <h2>Your Rights</h2>
        <p>
          You have the right to access, modify, or delete your personal data at any time. For any privacy-related inquiries, please contact our support team.
        </p>
      </section>
    </div>
  );
};

export default PrivacySecurity;
