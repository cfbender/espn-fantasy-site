const express = require("express");
const path = require("path");
const app = express();
const port = process.env.PORT || 5000;
const { Client } = require("espn-fantasy-football-api/node-dev");

const myClient = new Client({ leagueId: 38034 });
myClient.setCookies({
  espnS2:
    "AECn4e3%2BhT7TyVSPL9KxNDfxetQLcKyQuor0Sl30uzkggZtrSxgCfoLvI98Lm5ojjAsihAekSKRVl4nrvxis21kzLZ%2BVEwfCtksxBgNHLqwq8gOErpkR4fC4fOmth6bDFsNRozPtWNAvXD%2FaiGhyX08Goxwf7%2FZCaCaF4tsBGvMgbFeYZh%2FQJTW57E2IyDQwsjb0Jku2njUhj9ga5ki1MB488%2Fka4VZ03dnkDTvvMgiubYjbJWrThWjZlVnERKHollGUOTP9hgPfBds4KJcPyDPN",
  SWID: "{0B64B93E-FFBF-488E-8630-EF94F6EBD636}"
});

// CHANGE FOR FOLLOWING SEAONS
const seasonDetails = {
  seasonId: 2019,
  schedule: {}
};

app.use(express.static(path.join(__dirname, "client/build")));

app.get("/api/boxscore/", async (req, res) => {
  try {
    let data = await myClient.getBoxscoreForWeek({
      seasonId: seasonDetails.seasonId,
      matchupPeriodId: parseInt(req.query.matchupPeriodId),
      scoringPeriodId: parseInt(req.query.scoringPeriodId)
    });
    res.send(data);
  } catch (error) {
    throw error;
  }
});

app.get("/api/teams", async (req, res) => {
  try {
    let data = await myClient.getTeamsAtWeek({
      seasonId: seasonDetails.seasonId,
      scoringPeriodId: 0
    });
    res.send(data);
  } catch (error) {
    throw error;
  }
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "/client/build/index.html"));
});

app.listen(port, () => console.log(`Listening at http://localhost:${port}`));
