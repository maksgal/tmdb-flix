import React, { useState, useEffect } from "react";
import axios from "./axios";
import YouTube from "react-youtube";
//import videoSearch from "yt-search";
import "./Row.css";

const base_url = "https://image.tmdb.org/t/p/original/";
const YTAPI = "AIzaSyAPHLhP-mMSznBTCuIuducoyb6iESlFpIg";

function Row({ title, fetchURL, isLarge }) {
  const [movies, setMovies] = useState([]);
  const [trailerUrl, setTrailerUrl] = useState("");

  useEffect(() => {
    async function fetchData() {
      const request = await axios.get(fetchURL);
      setMovies(request.data.results);
      return request;
    }
    fetchData();
  }, [fetchURL]);
  const opts = {
    height: "390",
    width: "100%",
    playerVars: {
      autoplay: 1,
    },
  };

  const handleClick = async (movie) => {
    if (trailerUrl) {
      setTrailerUrl("");
    } else {
      const trailer = await axios.get(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=${
          movie.original_title ? movie.original_title : movie.name
        }%20trailer&type=video&key=${YTAPI}`
      );

      setTrailerUrl(trailer.data.items[0].id.videoId);
      console.log(trailer);
      window.onclick = () => setTrailerUrl("");
    }
  };

  return (
    <div className="row">
      <h2>{title}</h2>
      <div className="row__posters">
        {movies.map((movie) => (
          <img
            key={movie.id}
            onClick={() => handleClick(movie)}
            className={`row__poster && ${isLarge && "row__posterLarge"}`}
            src={`${base_url}${
              isLarge ? movie.poster_path : movie.backdrop_path
            }`}
            alt={movie?.name}
          />
        ))}
      </div>
      {trailerUrl && <YouTube videoId={trailerUrl} opts={opts} />}
    </div>
  );
}

export default Row;
