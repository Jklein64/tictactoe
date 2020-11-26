import React, { useEffect, useState } from 'react';
import styles from './Button.module.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  primary?: boolean;
  secondary?: boolean;
}

export default function Button({
  active = false,
  children,
  primary = false,
  secondary = false,
  ...props
}: ButtonProps) {
  const [isActive, setActive] = useState(active);
  useEffect(() => setActive(active), [active]);

  return (
    <button
      {...props}
      onClick={(e) => {
        if (props.onClick) props.onClick(e);
        setActive((p) => !p);
      }}
      className={[
        props.className,
        styles.base,
        isActive && styles.active,
        primary && styles.primary,
        secondary && styles.secondary,
        props.disabled && styles.disabled,
      ].join(' ')}
    >
      <span className={styles.content}>{children}</span>
    </button>
  );
}
