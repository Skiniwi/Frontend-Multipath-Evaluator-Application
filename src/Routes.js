import React from "react";
import Home from "./Home";

import App from "./App";
// import Private from "./Evaluation/Evaluator";
import { useRoutes } from "hookrouter";
import { NoPageFound } from "./Components/NoPageFound";
import Coordinates from "./Components/Map/coordinates";

const routes = {
  "/": () => <Home />,
  "/App": () => <App />,
  "/Map": () => <Coordinates />,
  // "/Evaluation": () => <Evaluator/>

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
