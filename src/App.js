import React from "react";
import "./App.css";
import { ApolloProvider } from "@apollo/react-hooks";
import GqlClient from "./Services/gqlClient";
import RequestsSub from "./Components/Map/RequestsSub";
import AddRequest from "./Components/Map/AddRequest";
// import FloatingWindow from "./Components/Evaluation/Window";
function App() {
  return (
    <ApolloProvider client={GqlClient}>
      <div className="App">
        <header className="App-header">Multipath Evaluator APP</header>
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
