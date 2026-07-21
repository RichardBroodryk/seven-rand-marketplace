import { useState } from "react";
import { Container, Heading, Input, TextArea, PrimaryButton } from "../../components/ui";
import { API_CONFIG } from "../../config/api";
import styles from "./SafetyCentrePage.module.css";

export default function SafetyCentrePage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
      const response = await fetch(`${API_CONFIG.BASE_URL}/contact/support`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to send message.");
      }

      setSuccess("Your message has been sent! We'll get back to you soon.");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container size="medium">
      <div className={styles.page}>
        <div className={styles.header}>
          <div className={styles.icon}>🛡️</div>
          <Heading as="h1" size="xl">Safety Centre</Heading>
          <p className={styles.subtitle}>
            Your safety matters. Here's how to buy and sell with confidence.
          </p>
        </div>

        <div className={styles.content}>
          <section className={styles.section}>
            <h2>For Buyers</h2>
            <div className={styles.tips}>
              <div className={styles.tip}>
                <span className={styles.tipIcon}>🔍</span>
                <div>
                  <h3>Check the Seller</h3>
                  <p>Always look for the Seven Shield badge. Verified sellers have completed identity verification.</p>
                </div>
              </div>
              <div className={styles.tip}>
                <span className={styles.tipIcon}>📱</span>
                <div>
                  <h3>Use Safe Verified Contact</h3>
                  <p>Never share personal contact details. Always use Safe Verified Contact to reach sellers.</p>
                </div>
              </div>
              <div className={styles.tip}>
                <span className={styles.tipIcon}>💰</span>
                <div>
                  <h3>Pay Safely</h3>
                  <p>We recommend using the platform's payment system. Never send money outside the platform.</p>
                </div>
              </div>
              <div className={styles.tip}>
                <span className={styles.tipIcon}>📸</span>
                <div>
                  <h3>Document Everything</h3>
                  <p>Take screenshots of listings and conversations. Keep records of all transactions.</p>
                </div>
              </div>
            </div>
          </section>

          <section className={styles.section}>
            <h2>For Sellers</h2>
            <div className={styles.tips}>
              <div className={styles.tip}>
                <span className={styles.tipIcon}>✓</span>
                <div>
                  <h3>Complete Verification</h3>
                  <p>Verified sellers build trust faster. Complete your verification to earn the Seven Shield badge.</p>
                </div>
              </div>
              <div className={styles.tip}>
                <span className={styles.tipIcon}>📝</span>
                <div>
                  <h3>Be Honest in Listings</h3>
                  <p>Accurate descriptions build reputation. Honesty is the foundation of trust.</p>
                </div>
              </div>
              <div className={styles.tip}>
                <span className={styles.tipIcon}>📷</span>
                <div>
                  <h3>Use Quality Photos</h3>
                  <p>Clear, honest photos help buyers understand what they're buying. Trust is built through transparency.</p>
                </div>
              </div>
              <div className={styles.tip}>
                <span className={styles.tipIcon}>💬</span>
                <div>
                  <h3>Communicate Clearly</h3>
                  <p>Respond promptly to inquiries. Clear communication builds confidence.</p>
                </div>
              </div>
            </div>
          </section>

          <section className={styles.section}>
            <h2>Red Flags to Watch For</h2>
            <ul className={styles.list}>
              <li>⚠️ Sellers who ask for payment outside the platform</li>
              <li>⚠️ Prices that seem too good to be true</li>
              <li>⚠️ Sellers who refuse to meet in person or verify their identity</li>
              <li>⚠️ Urgent pressure to complete a transaction quickly</li>
              <li>⚠️ Requests for personal information before verification</li>
            </ul>
          </section>

          {/* Contact Form Section */}
          <section className={styles.section}>
            <h2>Contact Support</h2>
            <p className={styles.contactIntro}>
              Have a question or need help? Fill in the form below and we'll get back to you within 24-48 hours.
            </p>

            {error && <div className={styles.errorBox}>{error}</div>}
            {success && <div className={styles.successBox}>{success}</div>}

            <form className={styles.contactForm} onSubmit={handleSubmit}>
              <div className={styles.formRow}>
                <Input
                  id="supportName"
                  name="name"
                  label="Your Name"
                  required
                  placeholder="John Doe"
                  value={form.name}
                  onChange={handleChange}
                />
                <Input
                  id="supportEmail"
                  name="email"
                  type="email"
                  label="Your Email"
                  required
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                />
              </div>

              <Input
                id="supportSubject"
                name="subject"
                label="Subject"
                placeholder="Brief description of your issue"
                value={form.subject}
                onChange={handleChange}
              />

              <TextArea
                id="supportMessage"
                name="message"
                label="Message"
                required
                rows={5}
                placeholder="Please provide as much detail as possible..."
                value={form.message}
                onChange={handleChange}
              />

              <PrimaryButton type="submit" disabled={loading}>
                {loading ? "Sending..." : "Send Message"}
              </PrimaryButton>
            </form>
          </section>
        </div>
      </div>
    </Container>
  );
}