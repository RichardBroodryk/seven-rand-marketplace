import { forwardRef } from "react";
import type { TextareaHTMLAttributes } from "react";
import styles from "./TextArea.module.css";

interface TextAreaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  helperText?: string;
  error?: string;
  required?: boolean;
}

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
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

        <textarea
          ref={ref}
          id={id}
          className={[
            styles.textarea,
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

TextArea.displayName = "TextArea";

export default TextArea;