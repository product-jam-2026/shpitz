"use client";

import styles from "./SkipButton.module.css";

interface SkipButtonProps {
  onClick?: () => void;
  disabled?: boolean;
}

export default function SkipButton({ onClick, disabled = false }: SkipButtonProps) {
  return (
    <button 
      className={styles.skipButton} 
      onClick={onClick}
      disabled={disabled}
    >
      <span className={styles.buttonText}>דלג</span>
    </button>
  );
}
