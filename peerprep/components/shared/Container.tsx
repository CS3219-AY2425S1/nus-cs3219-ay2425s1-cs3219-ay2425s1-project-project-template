import React, { ReactNode } from 'react';
import styles from '@/style/layout.module.css';

interface Props {
  children : ReactNode
}

function Container({ children }: Props) {
  return (
    <div className={styles.container}>
      {children}
    </div>
  )
}

export default Container;