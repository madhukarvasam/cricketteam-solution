const express = require("express");
const { open } = require("sqlite");
const path = require("path");
const sqlite3 = require("sqlite3");
const app = express();
const dbPath = path.join(__dirname, "cricketTeam.db");
app.use(express.json());
let database = null;
const initializeDBAndServer = async () => {
  try {
    database = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Is running on http://localhost:3000");
    });
  } catch (error) {
    console.log(`Data base Error is ${error}`);
    process.exit(1);
  }
};

initializeDBAndServer();

//API 1

const convertDBObject = (objectItem) => {
  return {
    playerId: objectItem.player_id,
    playerName: objectItem.player_name,
    jerseyNumber: objectItem.jersey_number,
    role: objectItem.role,
  };
};

app.get("/players/", async (request, response) => {
  const getPlayersQuery = `SELECT *
        From cricket_team`;
  const getPlayersQueryResponse = await database.all(getPlayersQuery);
  response.send(
    getPlayersQueryResponse.map((eachPlayer) => convertDBObject(eachPlayer))
  );
});

//API 2

app.post("/players/", async (request, response) => {
  const { playerName, jerseyNumber, role } = request.body;
  const createPlayerQuery = `INSERT INTO cricket_team(player_name, jersey_number, role)
        VALUES('${playerName}',${jerseyNumber},'${role}');`;
  const createPlayerQueryResponse = await database.run(createPlayerQuery);
  response.send(`Player Added to Team`);
});

//API 3

app.get("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const getPlayerDetailsQuery = `SELECT *
        FROM cricket_team
        WHERE player_id = ${playerId}`;
  const getPlayerDetailsQueryResponse = await database.get(
    getPlayerDetailsQuery
  );
  response.send(convertDBObject(getPlayerDetailsQueryResponse));
});

//API 4

app.put("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const { playerName, jerseyNumber, role } = request.body;
  const updatePlayerDetailsQuery = `UPDATE cricket_team
        SET player_name='${playerName}', jersey_number=${jersey_number}, role='${role}'
        WHERE player_id = ${playerId}`;
  const updatePlayerDetailsQueryResponse = await database.run(
    updatePlayerDetailsQuery
  );
  response.send(`Player Details Updated`);
});

//API 5

app.delete("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const deletePlayerQuery = `DELETE
        FROM cricket_team
        WHERE player_id= ${playerId}`;
  const deletePlayerQueryResponse = await database.run(deletePlayerQuery);
  response.send(`Player Removed`);
});

module.exports = app;
