import React, { useState } from "react";
import "./App.css";

function App() {
  const [teams, setTeams] = useState({});

  const getTeams = async () => {
    const response = await fetch("/api/teams");
    const teams = await response.json();
    setTeams(teams);
  };

  return (
    <div className="App">
      <h1 className="header">The Sunday Champs</h1>
      <p>{JSON.stringify(teams)}</p>
      <button onClick={getTeams}>Get Teams</button>
    </div>
  );
}

export default App;
