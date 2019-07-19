require("dotenv").config();

var axios = require("axios");
var spotify = require("node-spotify-api");
var spotifyKeys = require("./keys.js").spotify;

console.log(spotifyKeys);
var liriCommand = process.argv[2];

var customSearch = process.argv.slice(3).join("");

function runLiri(liriCommand, customSearch) {
  switch (liriCommand) {
    case "concert-this":
      getSpotify(customSearch);
      break;

    case "spotify-this-song":
      getBandsInTown(customSearch);
      break;

    case "movie-this":
      getOMDB(customSearch);
      break;

    case "do-what-it-says":
      getRandom();
      break;

    default:
      console.log("Enter one of the commands above");
  }
}

function getBandsInTown(artist) {
  var artist = customSearch;
  var artistQueryURL =
    "https://rest.bandsintown.com/bands/" +
    artist +
    "/events?app_id=f66eb880067a73f570e0d7fc347ead9b";

  axios.get(artistQueryURL).then(function(response) {
    console.log("Location: " + response.data[0].venue.city + "\r\n");
    console.log("Date of concert");
    console.log("Venue Name");
  });
}

function getSpotify(song) {
  var song = customSearch;
  var songQueryURL = "" + song + "";

  axios.get(songQueryURL).then(function(response) {
    console.log("Song name:" + response.data);
  });
}

// spotify.search({ type: "track", query: "Back in Black" }, function(err, data) {
//   if (err) {
//     return console.log("Error occurred: " + err);
//   }

//   console.log(data);
// });

function getOMDB(movie) {
  if (!movie) {
    movie = "Mad Max: Fury Road";
  }
  var movieQueryUrl = "http://www.omdbapi.com/?i=tt3896198&apikey=ec2c2c27";
  +movie + "ec2c2c27";

  axios.request(movieQueryUrl).then(function(response) {
    console.log("Title:" + response.data.Tile + "\r\n");
    console.log("Year Released:" + response.data.Year + "\r\n");
    console.log("IMDB Rating:" + response.data.imbdRating + "\r\n");
    console.log(
      "Rotten Tomatoes Rating:" + response.data.Ratings[1].Value + "\r\n"
    );
    console.log("Language" + response.data.Language + "\r\n");

    var saveMovie =
      "======Begin storing movie data======" +
      "\nMovie title:" +
      response.data.Title;

    fs.appendFile("random.txt", saveMovie);
  });
}
