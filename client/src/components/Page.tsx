import React from 'react';
import styles from './Page.module.css';

interface PageProps {
  children?: React.ReactNode;
}

const Page = ({ children }: PageProps) => (
  <main className={styles.page}>{children}</main>
);

export default Page;
