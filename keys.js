BandsInTownAPI = "https://app.swaggerhub.com/apis/Bandsintown/PublicAPI/3.0.0";

exports.spotify = {
  id: process.env.SPOTIFY_ID,
  secret: process.env.SPOTIFY_SECRET
};

exports.bands = {
  app_id: process.env.BANDS
};

exports.omdbkey = {
  key: process.env.OMDB_KEY
};
