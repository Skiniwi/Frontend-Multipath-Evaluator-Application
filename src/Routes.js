import React from "react";
import Home from "./Home";

import App from "./App";
// import Private from "./Evaluation/Evaluator";
import { useRoutes } from "hookrouter";
import { NoPageFound } from "./Components/NoPageFound";
const routes = {
  "/": () => <Home />,
  "/App": () => <App />,

};
function Routes() {
  const routeResult = useRoutes(routes)
  return (
    <div>
      {routeResult || <NoPageFound />}
    </div>
  );
}

export default Routes;
