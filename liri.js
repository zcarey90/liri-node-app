require("dotenv").config();

var axios = require("axios");
var Spotify = require("node-spotify-api");
var keys = require("./keys.js");
var moment = require("moment");
var fs = require("fs");

var liriCommand = process.argv[2];
// process.argv[0] = "node";
// process.argv[1] = "liri.js";
// var liriCommand = "concert-this";
// var customSearch = "blackkeys";

var customSearch = process.argv.slice(3).join("");

var spotify = new Spotify(keys.spotify);

function runLiri(liriCommand, customSearch) {
  switch (liriCommand) {
    case "concert-this":
      getBandsInTown(customSearch);
      break;

    case "spotify-this-song":
      getSpotify(customSearch);
      break;

    case "movie-this":
      getOMDB(customSearch);
      break;

    case "do-what-it-says":
      getRandom();
      console.log("runliri");
      break;

    default:
      console.log("Enter one of the following commands");
      console.log(
        "concert-this, spotify-this-song, movie-this, do-what-it-says"
      );
  }
}

function getBandsInTown(artist) {
  var artistQueryURL = "https://rest.bandsintown.com/artists/";
  artistQueryURL += artist;
  artistQueryURL += "/events?app_id=";
  artistQueryURL += keys.bands.app_id;
  axios
    .get(artistQueryURL)
    .then(function(response) {
      for (var z = 0; z < response.data.length; z++) {
        console.log(
          "Date of concert: " + moment(response.data[z].datetime).format("LLLL")
        );
        console.log("Location: " + response.data[z].venue.city);
        console.log("Venue Name: " + response.data[z].venue.name);
        console.log("------------------");
      }
    })
    .catch(function(err) {
      console.log(err);
    });
}

var getArtistNames = function(artist) {
  return artist.name;
};

function getSpotify(song) {
  if (song === undefined) {
    song = "back in black";
  }

  spotify.search({ type: "track", query: song }, function(err, data) {
    if (err) {
      return console.log("Error occurred: " + err);
    }
    var tracks = data.tracks.items;

    for (var z = 0; z < tracks.length; z++) {
      console.log(z);
      console.log("artist(s): " + tracks[z].artists.map(getArtistNames));
      console.log("song name: " + tracks[z].name);
      console.log("preview song: " + tracks[z].preview_url);
      console.log("album: " + tracks[z].album.name);
      console.log("------------------");
      var saveSongs =
        "======Begin storing song data======" + "\nSong name:" + tracks[z].name;

      fs.appendFile("./log.txt", saveSongs, err => {
        if (err) throw err;
        console.log('The "data to append" was appended to file!');
      });
    }

    console.log(data);
  });
}

function getRandom() {
  console.log("topofgetrandom");
  fs.readFile("./random.txt", "utf8", function(err, data) {
    if (err) throw err;
    var infoarray = data.split(",");
    console.log(infoarray);

    if (infoarray.length === 2) {
      runLiri(infoarray[0], infoarray[1]);
    } else if (infoarray.length === 1) {
      runLiri(infoarray[0]);
    }
  });
  console.log("bottomofgetrandom");
}

function getOMDB(movie) {
  if (!movie) {
    movie = "Mad Max: Fury Road";
  }
  var movieQueryUrl =
    "http://www.omdbapi.com/?t=" + movie + "&apikey=" + keys.omdbkey.key;

  axios
    .request(movieQueryUrl)
    .then(function(response) {
      console.log("Title:" + response.data.Title);
      console.log("Year Released:" + response.data.Year);
      console.log("IMDB Rating:" + response.data.Ratings[0].Value);
      console.log("Rotten Tomatoes Rating:" + response.data.Ratings[1].Value);
      console.log("Language" + response.data.Language);

      var saveMovie =
        "======Begin storing movie data======" +
        "\nMovie title:" +
        response.data.Title;

      fs.appendFile("./log.txt", saveMovie, err => {
        if (err) throw err;
        console.log('The "data to append" was appended to file!');
      });
    })
    .catch(function(error) {
      console.log(error);
    });
}

runLiri(liriCommand, customSearch);
