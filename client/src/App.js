import React, { useState, useEffect } from "react";
import Table from "./Table";
import "./App.css";

function App() {
  const [teams, setTeams] = useState({});

  const getTeams = async () => {
    const response = await fetch("/api/data");
    const teams = await response.json();
    setTeams(teams);
  };

  useEffect(() => {
    getTeams();
  }, []);

  return (
    <div className="App container">
      <h1 className="header mt-5 text-white">The Sunday Champs</h1>
      <h2 className="header text-white">Playoff Race</h2>
      <Table data={teams} />
    </div>
  );
}

export default App;
