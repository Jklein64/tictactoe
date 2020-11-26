import React, { useContext } from 'react';
import { TileState } from '@app/operation/TileState';
import { BoardContext } from '@app/operation/Context';
import { PlayerContext } from '@app/operation/Context';
import { PlayerState } from '@app/operation/enums';
import Button from '@app/components/Button';

interface TileProps {
  number: number;
  state: TileState;
}

export default function Tile({ number, state }: TileProps) {
  const [board, setBoard] = useContext(BoardContext) ?? [];
  const [player, _] = useContext(PlayerContext);

  return (
    <Button
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
