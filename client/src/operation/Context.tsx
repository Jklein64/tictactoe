import React, { createContext, useEffect, useRef, useState } from 'react';
import { TileState } from '@app/operation/TileState';
import { PlayerState } from '@app/operation/enums';

export const BoardContext = createContext<
  [TileState[], React.Dispatch<React.SetStateAction<TileState[]>>]
>([new Array(9).fill(TileState.Empty), () => {}]);

export const PlayerContext = createContext<
  [PlayerState, React.Dispatch<React.SetStateAction<PlayerState>>]
>([PlayerState.None, () => {}]);

export const WinningIndicesContext = createContext<number[]>([]);

interface BoardContextProps {
  children?: React.ReactNode;
}

export default function Context({ children }: BoardContextProps) {
  const [winningIndices, setWinningIndices] = useState<number[]>([]);
  const [player, setPlayerRaw] = useState(PlayerState.None);
  const [board, setBoardRaw] = useState<TileState[]>(
    new Array(9).fill(TileState.Empty),
  );

  const ws = useRef<WebSocket | null>(null);

  const setBoard = (value: React.SetStateAction<TileState[]>, send = true) => {
    if (send && ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({ type: 'board', body: value }));
    }

    return setBoardRaw(value);
  };

  const setPlayer = (value: React.SetStateAction<PlayerState>, send = true) => {
    if (send && ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({ type: 'player', body: value }));
    }
    return setPlayerRaw(value);
  };

  useEffect(() => {
    ws.current = new WebSocket(location.origin.replace(/^http/, 'ws'));
    ws.current.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data) as { type: 'board'; body: any };
        if (data.type === 'board') {
          setBoard(data.body, false);
        } else if (data.type === 'player') {
          setPlayer(data.body, false);
        }
      } catch (error) {
        // data is not json
        console.error('Data is not json: ' + e.data);
      }
    };
  }, []);

  useEffect(() => {
    const rows: [number, TileState][][] = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
    ].map((a) => a.map((v) => [v, board[v]]));

    const columns: [number, TileState][][] = [
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
    ].map((a) => a.map((v) => [v, board[v]]));

    const diagonals: [number, TileState][][] = [
      [0, 4, 8],
      [2, 4, 6],
    ].map((a) => a.map((v) => [v, board[v]]));

    const calcWinner = (
      ...groups: [number, TileState][][]
    ): [PlayerState, number[]] => {
      for (const group of groups)
        if (group.every((v) => v[1] === TileState.Player1))
          return [PlayerState.Player1, group.map((v) => v[0])];
        else if (group.every((v) => v[1] === TileState.Player2))
          return [PlayerState.Player2, group.map((v) => v[0])];
      return [PlayerState.None, []];
    };

    const [winner, indices] = calcWinner(...rows, ...columns, ...diagonals);
    if (winner !== PlayerState.None) {
      // if there is actually a winner
      if (winningIndices.length === 0) {
        // if there is not already a winner (derived)
        setWinningIndices(indices);
      }
    } else if (board.every((v) => v === TileState.Empty)) {
      // if the board has been reset
      setWinningIndices([]);
    }
  }, [board]);

  return (
    <BoardContext.Provider value={[board, setBoard]}>
      <PlayerContext.Provider value={[player, setPlayer]}>
        <WinningIndicesContext.Provider value={winningIndices}>
          {children}
        </WinningIndicesContext.Provider>
      </PlayerContext.Provider>
    </BoardContext.Provider>
  );
}
