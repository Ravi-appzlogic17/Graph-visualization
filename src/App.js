import React from "react";
import GraphComponent from "./GraphComponent";
import { BrowserRouter as Router } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <h1>Network Graph</h1>
      <li>
        Click on the DB Server to connect to DB Table.
      </li>
      <li>
        Click on the User then navigate to user section graph.
      </li>
      <Router>
      <GraphComponent />
    </Router>
    </div>
  );
}

export default App;