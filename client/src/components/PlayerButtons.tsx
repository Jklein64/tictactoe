import React, { useContext, useState } from 'react';
import Button from '@app/components/Button';
import styles from './PlayerButtons.module.css';
import { PlayerState } from '@app/operation/enums';
import { BoardContext, PlayerContext } from '@app/operation/Context';
import { TileState } from '@app/operation/TileState';

export default function PlayerButtons() {
  const [reset, setReset] = useState(false);
  const [player, setPlayer] = useContext(PlayerContext);
  const [_, setBoard] = useContext(BoardContext);

  const onPlayerButtonClicked = (p: PlayerState) => () => {
    setPlayer(p);
  };

  const onResetClicked = () => {
    setReset(true);
    setPlayer(PlayerState.None);
    setBoard(new Array(9).fill(TileState.Empty));
    setTimeout(() => {
      setReset(false);
    }, 500);
  };

  return (
    <section className={styles.container}>
      <Button
        onClick={onPlayerButtonClicked(PlayerState.Player1)}
        disabled={player !== PlayerState.None}
        active={player === PlayerState.Player1}
        className={styles.button}
        primary
      >
        I am player 1!
      </Button>
      <Button
        onClick={onPlayerButtonClicked(PlayerState.Player2)}
        disabled={player !== PlayerState.None}
        active={player === PlayerState.Player2}
        className={styles.button}
        secondary
      >
        I am player 2!
      </Button>
      <Button onClick={onResetClicked} className={styles.button} active={reset}>
        Reset
      </Button>
    </section>
  );
}
