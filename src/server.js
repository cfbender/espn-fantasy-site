const express = require("express");
const path = require("path");
const moment = require("moment");
const sortBy = require("lodash.sortby");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

const { Client } = require("espn-fantasy-football-api/node-dev");
const myClient = new Client({ leagueId: process.env.LEAGUEID });
myClient.setCookies({
  espnS2: process.env.ESPNS2,
  SWID: process.env.SWID
});

// CHANGE FOR FOLLOWING SEAONS
const seasonDetails = {
  seasonId: 2019,
  schedule: [
    {
      matchupPeriodId: 1,
      endDate: moment("09-10-2019", "MM-DD-YYYY")
    },
    {
      matchupPeriodId: 2,
      endDate: moment("09-17-2019", "MM-DD-YYYY")
    },
    {
      matchupPeriodId: 3,
      endDate: moment("09-24-2019", "MM-DD-YYYY")
    },
    {
      matchupPeriodId: 4,
      endDate: moment("10-1-2019", "MM-DD-YYYY")
    },
    {
      matchupPeriodId: 5,
      endDate: moment("10-8-2019", "MM-DD-YYYY")
    },
    {
      matchupPeriodId: 6,
      endDate: moment("10-15-2019", "MM-DD-YYYY")
    },
    {
      matchupPeriodId: 7,
      endDate: moment("10-22-2019", "MM-DD-YYYY")
    },
    {
      matchupPeriodId: 8,
      endDate: moment("10-29-2019", "MM-DD-YYYY")
    },
    {
      matchupPeriodId: 9,
      endDate: moment("11-5-2019", "MM-DD-YYYY")
    },
    {
      matchupPeriodId: 10,
      endDate: moment("11-12-2019", "MM-DD-YYYY")
    },
    {
      matchupPeriodId: 11,
      endDate: moment("11-19-2019", "MM-DD-YYYY")
    },
    {
      matchupPeriodId: 12,
      endDate: moment("11-26-2019", "MM-DD-YYYY")
    },
    {
      matchupPeriodId: 13,
      endDate: moment("12-2-2019", "MM-DD-YYYY")
    }
  ]
};

let dataCache = {};

const getCurrentWeek = async () => {
  let now = moment();

  for (let i = 0; i < seasonDetails.schedule.length; i++) {
    if (now.isBefore(seasonDetails.schedule[i].endDate)) {
      return seasonDetails.schedule[i - 1];
    }
  }
};

const updateData = async () => {
  console.log(`Data updating at ${moment().format("HH:mm - MM-DD-YYYY")}`);
  let currentWeek = await getCurrentWeek();
  let weeksIter = Array(currentWeek.matchupPeriodId)
    .fill()
    .map((x, i) => i);

  let teamData = await myClient.getTeamsAtWeek({
    seasonId: seasonDetails.seasonId,
    scoringPeriodId: 0
  });
  dataCache = {};

  for (let team of teamData) {
    dataCache[team.id] = {
      name: team.name,
      wins: team.wins,
      totalPoints: team.totalPointsScored,
      totalBenchPoints: 0,
      topHalves: 0,
      playoffPoints: team.wins
    };
  }
  for (let i in weeksIter) {
    let data = await myClient.getBoxscoreForWeek({
      seasonId: seasonDetails.seasonId,
      matchupPeriodId: seasonDetails.schedule[i].matchupPeriodId,
      scoringPeriodId: seasonDetails.schedule[i].matchupPeriodId
    });

    let highScores = [];

    for (let match of data) {
      let homeBench = 0;
      let awayBench = 0;
      for (let player of match.homeRoster) {
        if (player.position === "Bench") {
          homeBench += player.totalPoints;
        }
      }
      for (let player of match.awayRoster) {
        if (player.position === "Bench") {
          awayBench += player.totalPoints;
        }
      }

      dataCache[match.homeTeamId].totalBenchPoints += homeBench;
      dataCache[match.awayTeamId].totalBenchPoints += awayBench;

      highScores.push({
        score: match.awayScore,
        bench: awayBench,
        id: match.awayTeamId
      });
      highScores.push({
        score: match.homeScore,
        bench: homeBench,
        id: match.homeTeamId
      });
    }

    const sortedScores = sortBy(highScores, ["score", "bench", "id"]).slice(5);

    for (let result of sortedScores) {
      dataCache[result.id].topHalves++;
      dataCache[result.id].playoffPoints++;
    }
  }
  dataCache = sortBy(dataCache, [
    "playoffPoints",
    "totalPoints",
    "totalBenchPoints"
  ]).reverse();
};

updateData();

setInterval(updateData, 7200000);

app.use(express.static(path.join(__dirname, "..", "client/build")));

app.get("/api/data", (req, res) => {
  res.send(dataCache);
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "/client/build/index.html"));
});

app.listen(port, () => console.log(`Listening at http://localhost:${port}`));
