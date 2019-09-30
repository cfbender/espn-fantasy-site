import React from "react";

export default function Table({ data }) {
  const renderTableData = data =>
    Object.values(data).map(team => (
      <tr key={team.name} className="text-white">
        <td>{team.name}</td>
        <td>{team.totalPoints}</td>
        <td>{team.totalBenchPoints}</td>
        <td>{team.wins}</td>
        <td>{team.topHalves}</td>
        <td>{team.playoffPoints}</td>
      </tr>
    ));
  return (
    <div className="h-100 row align-items-center my-4 py-2 ">
      <table
        id="dtBasicExample"
        className="table table-striped table-bordered table-sm my-5"
        cellSpacing="0"
        width="60%"
      >
        <thead>
          <tr className="text-white">
            <th className="th-sm">Owner</th>
            <th className="th-sm">Total Points Scored</th>
            <th className="th-sm">Total Bench Points</th>
            <th className="th-sm">Matchups Won</th>
            <th className="th-sm">Weeks as Top Half Scorer</th>
            <th className="th-sm">Total Points for Playoffs</th>
          </tr>
        </thead>
        <tbody>{renderTableData(data)}</tbody>
      </table>
    </div>
  );
}
