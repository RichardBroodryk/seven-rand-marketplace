import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Heading, Input, PrimaryButton } from "../components/ui";
import { API_CONFIG } from "../config/api";
import styles from "./ForgotPasswordPage.module.css";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (!email) {
      setError("Please enter your email address.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong.");
      }

      setSuccess("If this email exists, a reset link has been sent.");
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send reset email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container size="small">
      <div className={styles.page}>
        <div className={styles.header}>
          <Heading as="h1" size="xl">Forgot Password</Heading>
          <p className={styles.subtitle}>
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>

        {error && <div className={styles.errorBox}>{error}</div>}
        {success && <div className={styles.successBox}>{success}</div>}

        <form className={styles.form} onSubmit={handleSubmit}>
          <Input
            id="email"
            name="email"
            type="email"
            label="Email Address"
            required
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />

          <PrimaryButton type="submit" fullWidth disabled={loading}>
            {loading ? "Sending..." : "Send Reset Link"}
          </PrimaryButton>

          <p className={styles.backLink}>
            <a href="/login" onClick={(e) => { e.preventDefault(); navigate("/login"); }}>
              ← Back to Sign In
            </a>
          </p>
        </form>
      </div>
    </Container>
  );
}