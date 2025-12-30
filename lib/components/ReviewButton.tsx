"use client";

import styles from "./ReviewButton.module.css";

interface NextButtonProps {
  onClick?: () => void;
  disabled?: boolean;
}

export default function NextButton({ onClick, disabled = false }: NextButtonProps) {
  return (
    <button 
      className={styles.reviewButton} 
      onClick={onClick}
      disabled={disabled}
    >
      <span className={styles.buttonText}>סיכום יומי</span>
    </button>
  );
}
