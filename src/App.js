import React from "react";
import "./App.css";
import { ApolloProvider } from "@apollo/react-hooks";
import GqlClient from "./Services/gqlClient";

import RequestsSub from "./Components/Map/RequestsSub";
import AddRequest from "./Components/Map/AddRequest";

function App() {
  return (
    <ApolloProvider client={GqlClient}>
      <div className="App">
        <header className="App-header">
          <h2> Client APP</h2>
        </header>
        <div>
          <AddRequest />
        </div>

        <div>
          <RequestsSub />
        </div>

      </div>
    </ApolloProvider >
  );
}

export default App;
