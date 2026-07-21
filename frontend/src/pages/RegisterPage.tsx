import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Heading, Input, PrimaryButton } from "../components/ui";
import { API_CONFIG, API_ENDPOINTS } from "../config/api";
import styles from "./RegisterPage.module.css";

interface RegisterForm {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState<RegisterForm>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    console.log("🟢 handleChange:", name, "=", value);
    setForm((prev) => {
      const updated = { ...prev, [name]: value };
      console.log("🟢 Updated form state:", updated);
      return updated;
    });
    if (error) setError(null);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("🔵 Form submitted. Current form state:", form);

    setError(null);
    setSuccess(null);

    // Check each field individually
    if (!form.firstName) {
      console.log("🔴 Missing: firstName");
      setError("Please enter your first name.");
      return;
    }
    if (!form.lastName) {
      console.log("🔴 Missing: lastName");
      setError("Please enter your last name.");
      return;
    }
    if (!form.email) {
      console.log("🔴 Missing: email");
      setError("Please enter your email address.");
      return;
    }
    if (!form.password) {
      console.log("🔴 Missing: password");
      setError("Please enter a password.");
      return;
    }
    if (!form.confirmPassword) {
      console.log("🔴 Missing: confirmPassword");
      setError("Please confirm your password.");
      return;
    }

    console.log("🟢 All fields present. Proceeding to API call.");

    if (form.password !== form.confirmPassword) {
      console.log("🔴 Passwords don't match");
      setError("Passwords do not match.");
      return;
    }

    if (form.password.length < 6) {
      console.log("🔴 Password too short");
      setError("Password must be at least 6 characters.");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        first_name: form.firstName,
        last_name: form.lastName,
        email: form.email,
        password: form.password,
      };
      console.log("🟢 Sending to backend:", payload);

      const response = await fetch(
        `${API_CONFIG.BASE_URL}${API_ENDPOINTS.AUTH}/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();
      console.log("🟢 Backend response:", data);

      if (!response.ok) {
        throw new Error(data.message || "We couldn't create your account. Please fill in all the fields.");
      }

      setSuccess("Welcome! You're all set to start buying and selling.");
      setForm({ firstName: "", lastName: "", email: "", password: "", confirmPassword: "" });

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      console.log("🔴 Error:", err);
      setError(err instanceof Error ? err.message : "We couldn't create your account. Please fill in all the fields.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container size="small">
      <div className={styles.page}>
        <div className={styles.header}>
          <Heading as="h1" size="xl">Create Account</Heading>
          <p className={styles.subtitle}>
            Join The Seven Rand Marketplace and start selling with trust.
          </p>
        </div>

        {error && (
          <div className={styles.errorBox} role="alert">
            <strong>Let's fix that:</strong> {error}
          </div>
        )}

        {success && (
          <div className={styles.successBox} role="status">
            <strong>🎉</strong> {success}
          </div>
        )}

        <form className={styles.form} onSubmit={handleSubmit}>
          <Input
            id="firstName"
            name="firstName"
            type="text"
            label="First Name"
            required
            placeholder="John"
            value={form.firstName}
            onChange={handleChange}
          />

          <Input
            id="lastName"
            name="lastName"
            type="text"
            label="Last Name"
            required
            placeholder="Doe"
            value={form.lastName}
            onChange={handleChange}
          />

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
            placeholder="Min 6 characters"
            value={form.password}
            onChange={handleChange}
            autoComplete="new-password"
          />

          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            label="Confirm Password"
            required
            placeholder="Confirm your password"
            value={form.confirmPassword}
            onChange={handleChange}
            autoComplete="new-password"
          />

          <PrimaryButton type="submit" fullWidth disabled={loading}>
            {loading ? "Creating Account..." : "Create Account"}
          </PrimaryButton>

          <p className={styles.loginLink}>
            Already have an account?{" "}
            <a href="/login" onClick={(e) => { e.preventDefault(); navigate("/login"); }}>
              Sign in here
            </a>
          </p>
        </form>
      </div>
    </Container>
  );
}