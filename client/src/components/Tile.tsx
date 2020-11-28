import React, { useContext } from 'react';
import { TileState } from '@app/operation/TileState';
import { PlayerState } from '@app/operation/enums';
import Button from '@app/components/Button';
import {
  BoardContext,
  WinningIndicesContext,
  PlayerContext,
} from '@app/operation/Context';

import styles from './Tile.module.css';

interface TileProps {
  number: number;
  state: TileState;
}

export default function Tile({ number, state }: TileProps) {
  const [board, setBoard] = useContext(BoardContext) ?? [];
  const [player, _] = useContext(PlayerContext);
  const winning = useContext(WinningIndicesContext).includes(number);

  return (
    <Button
      className={winning ? styles.winning : ''}
      primary={state === TileState.Player1}
      secondary={state === TileState.Player2}
      onClick={() => {
        if (state !== TileState.Empty) {
          return;
        } else if (player === PlayerState.Player1) {
          setBoard(board.map((v, i) => (i === number ? TileState.Player1 : v)));
        } else if (player === PlayerState.Player2) {
          setBoard(board.map((v, i) => (i === number ? TileState.Player2 : v)));
        }
      }}
      disabled={player === PlayerState.None}
      active={state !== TileState.Empty}
    ></Button>
  );
}
