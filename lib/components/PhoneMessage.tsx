import React from 'react';
import styles from './PhoneMessage.module.css';

export default function PhoneMessage() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <svg className={styles.avatar} width="43" height="43" viewBox="0 0 43 43" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="21.1272" cy="21.1272" r="21.1272" fill="#FFF9EC"/>
          </svg>
          <div className={styles.phoneNumber}>+972 528886666</div>
        </div>
      </div>
      <div className={styles.messageArea}>
        <div className={styles.messageContent}>
          <div className={styles.timestamp}>היום 9:07</div>
          <div className={styles.messageBubble}>
            <div className={styles.messageText}>
              <span className={styles.textNormal}>לקוח יקר, עקב תקלה נדרש לעדכן אמצעי התשלום לחשבונך באפליקציית bit כנס לקישור המצורף על מנת לעדכן </span>
              <span className={styles.textLink}>https://tinyurl.com/betti </span>
            </div>
            <div className={styles.scrollbar}>
              <div className={styles.scrollbarTrack}></div>
              <div className={styles.scrollbarThumb}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
