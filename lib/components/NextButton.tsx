"use client";

import styles from "./NextButton.module.css";

interface NextButtonProps {
  onClick?: () => void;
  disabled?: boolean;
}

export default function NextButton({ onClick, disabled = false }: NextButtonProps) {
  return (
    <button 
      className={styles.nextButton} 
      onClick={onClick}
      disabled={disabled}
    >
      <span className={styles.buttonText}>הבא</span>
    </button>
  );
}
