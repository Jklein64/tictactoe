import { WinningIndicesContext } from '@app/operation/Context';
import React, { useContext, useEffect, useState } from 'react';

import styles from './DancingChicken.module.css';

export default function DancingChicken() {
  const hasWinner = useContext(WinningIndicesContext).length > 0;

  const [pos, setPos] = useState([0, 0]);
  const [rot, setRot] = useState(0);
  const [x, y] = pos;

  useEffect(() => {
    const random = setInterval(() => {
      setPos([Math.random(), Math.random()]);
      setRot(Math.floor(Math.random() * 90 - 45));
    }, 1000);

    return () => clearInterval(random);
  }, []);

  if (!hasWinner) return null;

  return (
    <img
      style={{
        '--x': `calc(100vw * ${x})`,
        '--y': `calc(100vh * ${y})`,
        '--rotate': `${rot}deg`,
      }}
      className={styles.chicken}
      src="./dancing chicken.gif"
    ></img>
  );
}
