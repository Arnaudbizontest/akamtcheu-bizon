import React from 'react';
import logo from './logo.svg';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import './App.css';
import Accueil from "./components/accueil.component";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h2>Arnaud Kamtcheu - <span className="blue">Biz</span><span className="yellow">on</span> - Test javascript</h2>
      </header>
      <main>
        <Router>
          <div>
            <Route path="/akamtcheu-bizon" component={Accueil} />
          </div>
        </Router>
      </main>
    </div>
  );
}

export default App;
