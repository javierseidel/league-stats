const express = require('express');
const https = require('https');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');

const app = express();

app.use(bodyParser.urlencoded({
  extended: true
}));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");
})

const apikey = "RGAPI-29cef520-2476-4fb1-b796-a205ff5d68da"

app.post("/", function(req, res) {
  const summoner_name = req.body.summoner_name;
  //"seqoivvnq"

  //get/display the summoner level
  const summoner_level_api = "https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/" + summoner_name + "?api_key=" + apikey

  https.get(summoner_level_api, function(response) {


    response.on("data", function(data) {
      const lol_data = JSON.parse(data)
      const level = lol_data.summonerLevel
      const summoner_id = lol_data.id
      console.log(summoner_id)

      res.write("<h2>Summoner level: " + level + "</h>")


      //get/display ranked stats
      const rank_info_api = "https://na1.api.riotgames.com/lol/league/v4/entries/by-summoner/" + summoner_id + "?api_key=" + apikey

      https.get(rank_info_api, function(response) {


        response.on("data", function(data) {
          const lol_data = JSON.parse(data)
          const summoner_rank_div = lol_data[0].tier
          const summoner_rank_subdiv = lol_data[0].rank
          const wins = lol_data[0].wins
          const losses = lol_data[0].losses
          const lp = lol_data[0].leaguePoints
          var ratio = wins / losses

          res.write("<h2>Rank: " + summoner_rank_div + " " + summoner_rank_subdiv + " " + lp + " LP</h>")
          res.write("<h2>Wins: " + wins + "</h>")
          res.write("<h2>Losses: " + losses + "</h>")
          res.write("<h2>Win/Loss Ratio = " + ratio.toFixed(3) + "</h>")

  const champion_info_api = "https://na1.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-summoner/" + summoner_id + "?api_key=" + apikey
  const champion_id_list = "https://ddragon.leagueoflegends.com/cdn/11.14.1/data/en_US/champion.json"

  https.get(champion_info_api, function(response) {

    response.on("data", function(data){
      const lol_data = JSON.parse(data)
      const first_champ = lol_data[0].championId
      console.log(first_champ)
      const second_champ = lol_data[1].championId
      console.log(second_champ)
      res.write("<h2>"+second_champ+"</h>")
      const third_champ = lol_data[2].championId
      console.log(third_champ)
      res.write("<h2>"+third_champ+"</h>")

    async function fetchChampions(){

    const response = await fetch(champion_id_list)
    const champions = await response.json()
    for (var key in champions) {
    // skip loop if the property is from prototype
    if (!champions.hasOwnProperty(key)) continue;

    var obj = champions[key];
    for (var prop in obj) {
        // skip loop if the property is from prototype
        if (!obj.hasOwnProperty(prop)) continue;

        champ_id = obj[prop].key;

        if (champ_id == first_champ)
          res.write("<h2>"+prop+"</h>")
        else if (champ_id == second_champ)
          res.write("<h2>"+prop+"</h>")
        else if (champ_id == third_champ)
          res.write("<h2>"+prop+"</h>")

      }
    }

    res.send()
    }
    fetchChampions()

    })
  })
    }) //.on ranked stats
  }) //.get ranked stats








    }) //.on summoner id
  }) //.get summoner id
}) //.post whole app


app.listen(3000, function() {
  console.log("Server running");
});
