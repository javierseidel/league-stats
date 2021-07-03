const express = require('express');
const https = require('https');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded({
  extended: true
}));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");
})

const apikey = "RGAPI-d7b01d77-e931-45ba-892a-a1588cf24c3a"

app.post("/", function(req, res) {
  const summoner_name = req.body.summoner_name;
  //"seqoivvnq"

  //get/display the summoner level
  const summoner_level_api = "https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/" + summoner_name + "?api_key=" + apikey

  https.get(summoner_level_api, function(response) {
    console.log(response.statusCode);

    response.on("data", function(data) {
      const lol_data = JSON.parse(data)
      const level = lol_data.summonerLevel
      const summoner_id = lol_data.id
      console.log(summoner_id)
      console.log(level)
      res.write("<h2>Summoner level: " + level + "</h>")


      //get/display ranked stats
      const rank_info_api = "https://na1.api.riotgames.com/lol/league/v4/entries/by-summoner/" + summoner_id + "?api_key=" + apikey

      https.get(rank_info_api, function(response) {
        console.log(response.statusCode);

        response.on("data", function(data) {
          const lol_data = JSON.parse(data)
          const summoner_rank_div = lol_data[0].tier
          const summoner_rank_subdiv = lol_data[0].rank
          const wins = lol_data[0].wins
          const losses = lol_data[0].losses
          const lp = lol_data[0].leaguePoints
          var ratio = wins / losses
          console.log(summoner_rank_div)
          console.log(summoner_rank_subdiv)
          console.log(wins)
          console.log(losses)
          res.write("<h2>Rank: " + summoner_rank_div + " " + summoner_rank_subdiv + " " + lp + " LP</h>")
          res.write("<h2>Wins: " + wins + "</h>")
          res.write("<h2>Losses: " + losses + "</h>")
          res.write("<h2>Win/Loss Ratio = " + ratio.toFixed(3) + "</h>")
          res.send()
        }) //.on ranked stats

      }) //.get ranked stats

    }) //.on summoner id
  }) //.get summoner id
}) //.post whole app


app.listen(3000, function() {
  console.log("Server running");
});
