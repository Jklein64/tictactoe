import React, { useContext } from 'react';

import { TileState } from '@app/operation/TileState';
import { BoardContext } from '@app/operation/Context';
import styles from './Container.module.css';

interface ContainerProps {
  children: (board: TileState[]) => React.ReactNode;
}

export default function Container({ children }: ContainerProps) {
  const [board, _] = useContext(BoardContext) ?? [];

  return <div className={styles.container}>{children(board)}</div>;
}
