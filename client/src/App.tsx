import React from 'react';
import Container from '@app/components/Container';
import Tile from '@app/components/Tile';
import Page from '@app/components/Page';
import ContextProvider from '@app/operation/Context';

import './App.css';
import PlayerButtons from './components/PlayerButtons';

interface AppProps {}

function App({}: AppProps) {
  return (
    <Page>
      <ContextProvider>
        <PlayerButtons />
        <Container>
          {(board) =>
            board.map((state, i) => <Tile state={state} number={i} key={i} />)
          }
        </Container>
      </ContextProvider>
    </Page>
  );
}

export default App;
