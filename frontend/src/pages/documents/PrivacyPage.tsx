import { useState } from "react";
import { Container, Heading, Input, TextArea, PrimaryButton, Select } from "../../components/ui";
import { API_CONFIG } from "../../config/api";
import styles from "./PrivacyPage.module.css";

export default function PrivacyPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    requestType: "General Inquiry",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (error) setError(null);
    if (success) setSuccess(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (!form.name || !form.email || !form.message) {
      setError("Please fill in all required fields.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/contact/privacy`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to submit privacy request.");
      }

      setSuccess("Your privacy request has been submitted! Our privacy team will respond within 48 hours.");
      setForm({ name: "", email: "", requestType: "General Inquiry", message: "" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container size="medium">
      <div className={styles.page}>
        <div className={styles.header}>
          <div className={styles.icon}>🔒</div>
          <Heading as="h1" size="xl">Privacy & Data Protection</Heading>
          <p className={styles.subtitle}>
            Your data is yours. We protect it like it's our own.
          </p>
        </div>

        <div className={styles.content}>
          <section className={styles.section}>
            <h2>Our Commitment to Privacy</h2>
            <p>
              At The Seven Rand Marketplace, your privacy is not just a policy. It's a core part of our trust promise. 
              We collect only what we need to keep the marketplace safe and functioning.
            </p>
            <p>
              We never sell your data. We never share your contact details without your consent. 
              Your information is used to verify identity and protect transactions.
            </p>
          </section>

          <section className={styles.section}>
            <h2>What We Collect</h2>
            <div className={styles.grid}>
              <div className={styles.card}>
                <span className={styles.cardIcon}>📧</span>
                <h3>Email Address</h3>
                <p>Used for account creation, verification, and secure communication.</p>
              </div>
              <div className={styles.card}>
                <span className={styles.cardIcon}>📱</span>
                <h3>Mobile Number</h3>
                <p>Used for verification and Safe Verified Contact delivery.</p>
              </div>
              <div className={styles.card}>
                <span className={styles.cardIcon}>👤</span>
                <h3>Profile Information</h3>
                <p>Name, location, and transaction history for trust building.</p>
              </div>
              <div className={styles.card}>
                <span className={styles.cardIcon}>💳</span>
                <h3>Payment Details</h3>
                <p>Processed securely through PayFast. We never store your payment information.</p>
              </div>
            </div>
          </section>

          <section className={styles.section}>
            <h2>How We Protect Your Data</h2>
            <div className={styles.protection}>
              <div className={styles.protectionItem}>
                <span>🔐</span>
                <div>
                  <h4>Encryption</h4>
                  <p>All data is encrypted in transit and at rest. Your information is always protected.</p>
                </div>
              </div>
              <div className={styles.protectionItem}>
                <span>🛡️</span>
                <div>
                  <h4>Access Control</h4>
                  <p>Only authorized personnel can access user data. All access is logged and monitored.</p>
                </div>
              </div>
              <div className={styles.protectionItem}>
                <span>📋</span>
                <div>
                  <h4>POPIA Compliance</h4>
                  <p>We fully comply with South Africa's Protection of Personal Information Act (POPIA).</p>
                </div>
              </div>
              <div className={styles.protectionItem}>
                <span>🔍</span>
                <div>
                  <h4>Transparency</h4>
                  <p>You can request a copy of your data or ask us to delete it at any time.</p>
                </div>
              </div>
            </div>
          </section>

          <section className={styles.section}>
            <h2>Safe Verified Contact Privacy</h2>
            <p>
              Your contact details are never shared with buyers until you have an active Safe Verified Contact transaction.
              Even then, buyers only receive verified information after they've paid.
            </p>
            <p>
              <strong>Your phone number and email are never visible on the platform.</strong> 
              They are only shared through the secure Safe Verified Contact system.
            </p>
          </section>

          <section className={styles.section}>
            <h2>Your Rights</h2>
            <ul className={styles.list}>
              <li>✓ Access your personal data at any time</li>
              <li>✓ Request corrections to your data</li>
              <li>✓ Request deletion of your data</li>
              <li>✓ Withdraw consent at any time</li>
              <li>✓ Lodge a complaint with the Information Regulator</li>
            </ul>
          </section>

          {/* Contact Form Section */}
          <section className={styles.section}>
            <h2>Submit a Privacy Request</h2>
            <p className={styles.contactIntro}>
              Have questions about your data or want to make a request? Fill in the form below.
            </p>

            {error && <div className={styles.errorBox}>{error}</div>}
            {success && <div className={styles.successBox}>{success}</div>}

            <form className={styles.contactForm} onSubmit={handleSubmit}>
              <div className={styles.formRow}>
                <Input
                  id="privacyName"
                  name="name"
                  label="Your Name"
                  required
                  placeholder="John Doe"
                  value={form.name}
                  onChange={handleChange}
                />
                <Input
                  id="privacyEmail"
                  name="email"
                  type="email"
                  label="Your Email"
                  required
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                />
              </div>

              <Select
                id="privacyRequestType"
                name="requestType"
                label="Request Type"
                value={form.requestType}
                onChange={handleChange}
              >
                <option value="General Inquiry">General Inquiry</option>
                <option value="Access My Data">Access My Data</option>
                <option value="Correct My Data">Correct My Data</option>
                <option value="Delete My Data">Delete My Data</option>
                <option value="Withdraw Consent">Withdraw Consent</option>
                <option value="Complaint">Lodge a Complaint</option>
              </Select>

              <TextArea
                id="privacyMessage"
                name="message"
                label="Message"
                required
                rows={5}
                placeholder="Please provide as much detail as possible..."
                value={form.message}
                onChange={handleChange}
              />

              <PrimaryButton type="submit" disabled={loading}>
                {loading ? "Submitting..." : "Submit Privacy Request"}
              </PrimaryButton>
            </form>
          </section>
        </div>
      </div>
    </Container>
  );
}