import React, { FunctionComponent } from 'react';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';

import './App.css';
import './components/Card.css';

import { BreakpointProvider } from './helpers/breakpoint';
import { device } from './helpers/device';
import Home from './components/Home';

const client = new ApolloClient({
  uri: process.env.REACT_APP_API_ENDPOINT,
  cache: new InMemoryCache() as any
});

const App: FunctionComponent = () => {
  return (
    <BreakpointProvider queries={device}>
      <ApolloProvider client={client}>
        <div className="App">
          <Home />
        </div>
      </ApolloProvider>
    </BreakpointProvider>
  );
}

export default App;
