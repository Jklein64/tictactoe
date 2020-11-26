import React, { createContext, useEffect, useRef, useState } from 'react';
import { TileState } from '@app/operation/TileState';
import { PlayerState } from '@app/operation/enums';

export const BoardContext = createContext<
  [TileState[], React.Dispatch<React.SetStateAction<TileState[]>>]
>([new Array(9).fill(TileState.Empty), () => {}]);

export const PlayerContext = createContext<
  [PlayerState, React.Dispatch<React.SetStateAction<PlayerState>>]
>([PlayerState.None, () => {}]);

interface BoardContextProps {
  children?: React.ReactNode;
}

export default function Context({ children }: BoardContextProps) {
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

  return (
    <BoardContext.Provider value={[board, setBoard]}>
      <PlayerContext.Provider value={[player, setPlayer]}>
        {children}
      </PlayerContext.Provider>
    </BoardContext.Provider>
  );
}
