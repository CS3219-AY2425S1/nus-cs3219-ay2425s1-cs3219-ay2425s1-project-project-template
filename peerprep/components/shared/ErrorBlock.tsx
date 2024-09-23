import React from 'react'
import styles from '@/style/error.module.css';
import { ErrorBody } from '@/api/structs';

interface Props {
  err : ErrorBody
}

function ErrorBlock({ err }: Props) {
  return (
  <div className={styles.container}>
    <h1 className={styles.title}>
      {err.status}: We've seen better days.
    </h1>
    <p className={styles.details}>
      Reason: {err.error}
    </p>
  </div>
  )
}

export default ErrorBlock