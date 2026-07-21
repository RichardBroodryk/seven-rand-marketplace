import { useState } from "react";
import { Container, Heading, Input, TextArea, PrimaryButton, Select } from "../../components/ui";
import { API_CONFIG } from "../../config/api";
import styles from "./ResolutionCentrePage.module.css";

export default function ResolutionCentrePage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    listingId: "",
    orderNumber: "",
    issueType: "General",
    description: "",
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

    if (!form.name || !form.email || !form.description) {
      setError("Please fill in all required fields.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/contact/resolution`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to submit resolution request.");
      }

      setSuccess("Your resolution request has been submitted! We'll review your case within 24 hours.");
      setForm({ name: "", email: "", listingId: "", orderNumber: "", issueType: "General", description: "" });
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
          <div className={styles.icon}>⚖️</div>
          <Heading as="h1" size="xl">Resolution Centre</Heading>
          <p className={styles.subtitle}>
            Trust doesn't end when something goes wrong. That's when it matters most.
          </p>
        </div>

        <div className={styles.content}>
          <section className={styles.section}>
            <h2>Our Resolution Philosophy</h2>
            <p>
              We believe in fairness. When something goes wrong, we work with both parties to 
              find a resolution that builds trust, not breaks it.
            </p>
            <p>
              The Seven Rand Marketplace is built on the belief that trust is more valuable 
              than any transaction. We protect that trust, even when deals don't go as planned.
            </p>
          </section>

          <section className={styles.section}>
            <h2>Common Resolution Scenarios</h2>
            <div className={styles.scenario}>
              <span className={styles.scenarioIcon}>📱</span>
              <div>
                <h3>Invalid Contact Details</h3>
                <p>
                  If the contact details provided through Safe Verified Contact are invalid or don't work, 
                  we investigate and provide a refund or credit for the contact fee.
                </p>
              </div>
            </div>
            <div className={styles.scenario}>
              <span className={styles.scenarioIcon}>❌</span>
              <div>
                <h3>Item Already Sold</h3>
                <p>
                  If you paid for contact details but the item was already sold, we issue a full refund 
                  of your contact fee. Sellers are encouraged to mark listings as sold promptly.
                </p>
              </div>
            </div>
            <div className={styles.scenario}>
              <span className={styles.scenarioIcon}>🚫</span>
              <div>
                <h3>Fraud or Scam</h3>
                <p>
                  If we confirm fraudulent activity, the buyer receives a full refund. The seller's 
                  account is suspended and reported to the relevant authorities.
                </p>
              </div>
            </div>
            <div className={styles.scenario}>
              <span className={styles.scenarioIcon}>📝</span>
              <div>
                <h3>Misleading Description</h3>
                <p>
                  If the item is significantly different from the listing description, we work with 
                  both parties to reach a fair resolution.
                </p>
              </div>
            </div>
          </section>

          <section className={styles.section}>
            <h2>How to Start a Resolution</h2>
            <ol className={styles.list}>
              <li>
                <strong>Contact the seller first</strong> - Many issues can be resolved quickly 
                through direct communication.
              </li>
              <li>
                <strong>Document everything</strong> - Take screenshots of the listing, conversations, 
                and any relevant information.
              </li>
              <li>
                <strong>Submit a resolution request</strong> - Use the form below to tell us what happened.
              </li>
              <li>
                <strong>We investigate</strong> - Our team reviews the case and works with both parties.
              </li>
              <li>
                <strong>Resolution is reached</strong> - We communicate the outcome and any actions taken.
              </li>
            </ol>
          </section>

          {/* Contact Form Section */}
          <section className={styles.section}>
            <h2>Submit a Resolution Request</h2>
            <p className={styles.contactIntro}>
              Fill in the form below and our team will review your case within 24 hours.
            </p>

            {error && <div className={styles.errorBox}>{error}</div>}
            {success && <div className={styles.successBox}>{success}</div>}

            <form className={styles.contactForm} onSubmit={handleSubmit}>
              <div className={styles.formRow}>
                <Input
                  id="resolutionName"
                  name="name"
                  label="Your Name"
                  required
                  placeholder="John Doe"
                  value={form.name}
                  onChange={handleChange}
                />
                <Input
                  id="resolutionEmail"
                  name="email"
                  type="email"
                  label="Your Email"
                  required
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                />
              </div>

              <div className={styles.formRow}>
                <Input
                  id="resolutionListingId"
                  name="listingId"
                  label="Listing ID (if applicable)"
                  placeholder="e.g. 123e4567-e89b-12d3-a456-426614174000"
                  value={form.listingId}
                  onChange={handleChange}
                />
                <Input
                  id="resolutionOrderNumber"
                  name="orderNumber"
                  label="Order Number (if applicable)"
                  placeholder="e.g. ORD-123456"
                  value={form.orderNumber}
                  onChange={handleChange}
                />
              </div>

              <Select
                id="resolutionIssueType"
                name="issueType"
                label="Issue Type"
                value={form.issueType}
                onChange={handleChange}
              >
                <option value="General">General</option>
                <option value="Invalid Contact">Invalid Contact Details</option>
                <option value="Item Not Received">Item Not Received</option>
                <option value="Item Not As Described">Item Not As Described</option>
                <option value="Fraud Suspected">Fraud Suspected</option>
                <option value="Urgent">Urgent - Requires Immediate Attention</option>
              </Select>

              <TextArea
                id="resolutionDescription"
                name="description"
                label="Detailed Description"
                required
                rows={5}
                placeholder="Please provide as much detail as possible..."
                value={form.description}
                onChange={handleChange}
              />

              <PrimaryButton type="submit" disabled={loading}>
                {loading ? "Submitting..." : "Submit Resolution Request"}
              </PrimaryButton>
            </form>
          </section>
        </div>
      </div>
    </Container>
  );
}