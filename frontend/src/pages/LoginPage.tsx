import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Heading, Input, PrimaryButton } from "../components/ui";
import { API_CONFIG, API_ENDPOINTS } from "../config/api";
import styles from "./LoginPage.module.css";

interface LoginForm {
  email: string;
  password: string;
}

interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: {
      id: string;
      first_name: string;
      last_name: string;
      email: string;
      mobile?: string;
      province?: string;
      city?: string;
      is_verified: boolean;
      reputation_score: number;
    };
  };
}

export default function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState<LoginForm>({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (error) setError(null);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!form.email || !form.password) {
      setError("Please enter both email and password.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${API_CONFIG.BASE_URL}${API_ENDPOINTS.AUTH}/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );

      const data: LoginResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "We couldn't sign you in. Double-check your email and password.");
      }

      localStorage.setItem("token", data.data.token);

      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "We couldn't sign you in. Double-check your email and password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container size="small">
      <div className={styles.page}>
        <div className={styles.header}>
          <Heading as="h1" size="xl">Sign In</Heading>
          <p className={styles.subtitle}>
            Great to see you again! Sign in to post ads and manage your listings.
          </p>
        </div>

        {error && (
          <div className={styles.errorBox} role="alert">
            <strong>Let's fix that:</strong> {error}
          </div>
        )}

        <form className={styles.form} onSubmit={handleSubmit}>
          <Input
            id="email"
            name="email"
            type="email"
            label="Email Address"
            required
            placeholder="you@example.com"
            value={form.email}
            onChange={handleChange}
            autoComplete="email"
          />

          <Input
            id="password"
            name="password"
            type="password"
            label="Password"
            required
            placeholder="Enter your password"
            value={form.password}
            onChange={handleChange}
            autoComplete="current-password"
          />

          <PrimaryButton type="submit" fullWidth disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </PrimaryButton>

          <p className={styles.registerLink}>
            Don't have an account?{" "}
            <a href="/register" onClick={(e) => { e.preventDefault(); navigate("/register"); }}>
              Join us!
            </a>
          </p>
        </form>
      </div>
    </Container>
  );
}