import styles from "./SectionHeading.module.css";

interface SectionHeadingProps {
  children: React.ReactNode;
}

export default function SectionHeading({ children }: SectionHeadingProps) {
  return (
    <div className={styles.heading}>
      <span className={styles.text}>{children}</span>
    </div>
  );
}
