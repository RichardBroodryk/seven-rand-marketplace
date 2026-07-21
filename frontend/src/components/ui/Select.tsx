import { forwardRef } from "react";
import type { SelectHTMLAttributes } from "react";
import styles from "./Select.module.css";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  helperText?: string;
  error?: string;
  required?: boolean;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      helperText,
      error,
      required = false,
      id,
      className = "",
      children,
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

        <select
          ref={ref}
          id={id}
          className={[
            styles.select,
            error ? styles.error : "",
            className,
          ]
            .filter(Boolean)
            .join(" ")}
          {...props}
        >
          {children}
        </select>

        {error ? (
          <p className={styles.errorText}>{error}</p>
        ) : helperText ? (
          <p className={styles.helperText}>{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Select.displayName = "Select";

export default Select;