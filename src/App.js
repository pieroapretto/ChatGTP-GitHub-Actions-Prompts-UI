import React from "react";
import { Switch, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import AddPrompt from "./components/add-prompt.component";
import PromptsList from "./components/prompt-list.component";
import EditPrompt from "./components/edit-prompt.component";

const App = () => {
  return (
    <div>
      <nav className="navbar navbar-expand navbar-dark bg-dark">
        <div className="navbar-nav mr-auto">
          <li className="nav-item">
            <Link to={"/prompts-list"} className="nav-link">
              See Prompts
            </Link>
          </li>
          <li className="nav-item">
            <Link to={"/add-prompt"} className="nav-link">
              Add Prompt
            </Link>
          </li>
        </div>
      </nav>

      <div className="container mt-3">
        <Switch>
          <Route exact path={["/", "/prompts-list"]} component={PromptsList} />
          <Route exact path="/add-prompt" component={AddPrompt} />
          <Route path="/edit-prompt/:id" component={EditPrompt} />
        </Switch>
      </div>
    </div>
  );
};

export default App;