import { useState } from "react";
import Input from "./Input";
import styles from "./PasswordInput.module.css";

interface PasswordInputProps {
  id: string;
  name: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  autoComplete?: string;
  error?: string;
}

export default function PasswordInput({
  id,
  name,
  label,
  value,
  onChange,
  placeholder = "Enter password",
  required = false,
  autoComplete,
  error,
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className={styles.wrapper}>
      <Input
        id={id}
        name={name}
        type={showPassword ? "text" : "password"}
        label={label}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        autoComplete={autoComplete}
        error={error}
        className={styles.passwordInput}
      />
      <button
        type="button"
        className={styles.toggleButton}
        onClick={() => setShowPassword(!showPassword)}
        tabIndex={-1}
      >
        {showPassword ? "🙈" : "👁️"}
      </button>
    </div>
  );
}