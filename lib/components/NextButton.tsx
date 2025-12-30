"use client";

import styles from "./NextButton.module.css";

interface NextButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  text?: string;
}

export default function NextButton({ onClick, disabled = false, text = "הבא" }: NextButtonProps) {
  return (
    <button 
      className={styles.nextButton} 
      onClick={onClick}
      disabled={disabled}
    >
      <span className={styles.buttonText}>{text}</span>
    </button>
  );
}