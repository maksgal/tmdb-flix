import React, { useState, useEffect } from "react";
import axios from "./axios";
import YouTube from "react-youtube";
import requests from "./requests";
import "./Banner.css";
export default function Banner() {
  const [movie, setMovie] = useState([]);
  const [trailerUrl, setTrailerUrl] = useState("");
  const YTAPI = "AIzaSyAPHLhP-mMSznBTCuIuducoyb6iESlFpIg";
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

  useEffect(() => {
    async function fetchData() {
      const request = await axios.get(requests.fetchDocumentaries);
      setMovie(
        request.data.results[
          Math.floor(Math.random() * request.data.results.length - 1)
        ]
      );
      return request;
    }
    fetchData();
  }, []);

  function truncate(str, n) {
    return str?.length > n ? str.substr(0, n - 1) + "..." : str;
  }

  return (
    <header
      className="banner"
      style={{
        backgroundSize: "cover",
        backgroundPosition: "center center",
        backgroundImage: `url(
            "https://image.tmdb.org/t/p/original/${movie?.backdrop_path}"
            )`,
      }}>
      <div className="banner__contents">
        <h1 className="banner__title">
          {movie?.title ||
            movie?.name ||
            movie?.original_name ||
            movie?.original_title}
        </h1>
        <div className="buttons">
          <button className="banner__button" onClick={() => handleClick(movie)}>
            Play Trailer
          </button>
        </div>
        <p className="banner__description">{truncate(movie?.overview, 250)}</p>
      </div>
      <div className="banner--fadeBottom"> </div>
      {trailerUrl && (
        <YouTube className="banner__trailer" videoId={trailerUrl} opts={opts} />
      )}
    </header>
  );
}
