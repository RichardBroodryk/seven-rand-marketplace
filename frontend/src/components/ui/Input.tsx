import { forwardRef } from "react";
import type { InputHTMLAttributes } from "react";
import styles from "./Input.module.css";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  required?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      helperText,
      error,
      required = false,
      id,
      className = "",
      ...props
    },
    ref
  ) => {
    return (
      <div className={styles.wrapper}>
        {label && (
          <label htmlFor={id} className={styles.label}>
            {label}

            {required && (
              <span className={styles.required}>*</span>
            )}
          </label>
        )}

        <input
          ref={ref}
          id={id}
          className={[
            styles.input,
            error ? styles.error : "",
            className,
          ]
            .filter(Boolean)
            .join(" ")}
          {...props}
        />

        {error ? (
          <p className={styles.errorText}>{error}</p>
        ) : helperText ? (
          <p className={styles.helperText}>{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;