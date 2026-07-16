import { useState } from "react";
import type { KeyboardEvent } from "react";
import styles from "./SearchBox.module.css";

interface SearchBoxProps {
  placeholder?: string;
  initialValue?: string;
  loading?: boolean;
  showButton?: boolean;
  onSearch?: (value: string) => void;
}

export default function SearchBox({
  placeholder = "Search...",
  initialValue = "",
  loading = false,
  showButton = true,
  onSearch,
}: SearchBoxProps) {
  const [value, setValue] = useState(initialValue);

  const search = () => {
    onSearch?.(value.trim());
  };

  const handleKeyDown = (
    event: KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter") {
      search();
    }
  };

  return (
    <div className={styles.container}>
      <input
        className={styles.input}
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
      />

      {value && !loading && (
        <button
          type="button"
          className={styles.clear}
          onClick={() => setValue("")}
          aria-label="Clear search"
        >
          ×
        </button>
      )}

      {showButton && (
        <button
          type="button"
          className={styles.button}
          onClick={search}
          disabled={loading}
        >
          {loading ? "Searching..." : "Search"}
        </button>
      )}
    </div>
  );
}