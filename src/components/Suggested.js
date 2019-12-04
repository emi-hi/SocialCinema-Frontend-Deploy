import "./Suggested.scss"

import React from "react";
import axios from "axios";
// import './App.css';

export default function Suggested(props) {
  // const [suggested, setSuggested] = useState("hide")

  const newMovie = () => {
    props.setSuggested("waiting")
    let group;
    if (props.theme) {
      group = [];
    } else {
      group = props.group;
    }
    axios.post(`/suggestion`, { userGenrePreferences: props.userGenres, group, recentSuggestions: props.recentSuggestions})
      .then(response => {
        props.setSuggested("show")
        props.setSuggestedMovie({
          "title": response.data.title,
          "description": response.data.description,
          "poster": response.data.poster,
          "releaseDate": response.data.release_date,
          "tmdbId": response.data.tmdb_id,
          "imdb_link": response.data.imdb_link,
          "runtime" : response.data.runtime,
          "error": response.data.error,
          "rating": response.data.rating
        });
        props.getRecentSuggestions(response.data);
      })
      .catch(error => {console.log(error)})
  };

  const saveToLaterList = (userName, suggestedMovie) => {
    axios.post(`/api/${userName}/latermovies`, { suggestedMovie })
    .then(response => {
      props.setLaterMovies(response.data.later_movies)
    })
    .catch(error => {console.log(error)})
  };

  let runtime;

  if (props.suggestedMovie.runtime) {
    runtime = props.suggestedMovie.runtime + ' minutes'
  }

  let error = ""
  if(props.suggestedMovie.error === "group") {
    error = "As a group, you hate all movie genres. To receive a curated movie suggestion, try setting a theme night. Otherwise, we suggest you watch Bob Ross! No one hates Bob Ross."
  } else if(props.suggestedMovie.error === "solo") {
    error = "You currently hate all movie genres. Update your preferences to receive a curated movie suggestion. Otherwise, we suggest you watch Bob Ross! No one hates Bob Ross."
  }

  return (
    <section className="suggested-container">
      {props.suggested === "hide" &&
        <>
          <h1>Click the Reel to Generate Your First Movie Suggestion</h1>
          <img src="images/roundreel.png" alt="click to generate a suggestion!" className="reel" onClick={() => {newMovie()}}/>
        </>
      }
      {props.suggested === "waiting" &&
      <>
        <h1>Searching for a Movie Match...</h1>
        <img className="spinner" src="images/roundreel.png" alt="spinning film wheel"/>
      </>
      }
      {props.suggested === "show" && 
        <>
          <section className="suggestion">
            <header>
              {error && <h5 className="suggestion-error">{error}</h5>}
              <h2 className="movie-title">{props.suggestedMovie.title}</h2>
            </header>
            <main className="suggestion-info">
              <img alt={props.suggestedMovie.title} src={props.suggestedMovie.poster} className="movie-poster"></img>
              <article>
                <h6 className="next">New Suggestion</h6>
                <img className="next" src="images/roundreel.png" alt="click to generate another suggestion" onClick={()=>newMovie()}></img>
                <h4>{props.suggestedMovie.releaseDate}</h4>
                <p>{props.suggestedMovie.description}</p>
                <span>{props.suggestedMovie.rating}</span>
                <span>{runtime}</span>
                <a href={props.suggestedMovie.imdb_link} target="_blank" rel="noopener noreferrer"><b>Learn more at IMDB</b></a>
                {props.user.name && <><h6 className="later">Watch Later</h6><img className="later" src="images/later.png" alt="Add to later" onClick={()=>{saveToLaterList(props.user.name, props.suggestedMovie)}}></img></>}
              </article>
            </main>
          </section>
        </>
      }
    </section>
  );
}