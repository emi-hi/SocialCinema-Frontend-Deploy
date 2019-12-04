import { useReducer, useEffect } from "react";
import reducer, { SET_USER, SET_GENRES, SET_LATER_MOVIES, SET_FRIENDS, SET_GROUP, SET_FAVORITE_MOVIES, SET_THEME } from "../reducers/application";
import axios from 'axios'

const initGenres = () => {
  let genres = []
  return axios.get("/api/genres")
  .then(response => {
    genres = response.data.map(genre => {
      return genre = {
        id: genre.id,
        preference: null
      }
    })
    return genres
  })
  .catch(error => {console.log(error)})
};

export default function useApplicationData() {
  const [state, dispatch] = useReducer(reducer, {
    user: JSON.parse(localStorage.getItem('user')) || "",
    genres: [],
    favorited_movies: JSON.parse(localStorage.getItem('favoritedMovies')) || [],
    later_movies: JSON.parse(localStorage.getItem('laterMovies')) || [],
    friends: [],
    group: JSON.parse(localStorage.getItem('group')) || [],
    theme: false
  });

  useEffect(() => {
    initGenres()
    .then(res => {
      setGenres(res);
    })
  }, [])

  useEffect(() => {
    if (state.user !== "") {
      Promise.all([
        axios.get(`/api/${state.user.name}/genres`),
        axios.get("/api/users")
      ])
      .then((all) => {
        setGenres(all[0].data.genres)
        setFriends(all[1].data.users)
      })
      .catch(error => {console.log(error)})
    }
  }, [state.user])

  const setUser = user => {
    localStorage.setItem('user', JSON.stringify(user));
    dispatch({ type: SET_USER, value: user });
  };

  const getGenres = () => {
    axios.get(`/api/${state.user.name}/genres`)
    .then(res => {
      setGenres(res.data.genres)
    })
  }

  const setGenres = genres => {
    if (genres.length === 0) {
      initGenres()
      .then(res => {
        dispatch({ type: SET_GENRES, value: res });
      })
    } else {
      dispatch({ type: SET_GENRES, value: genres });
    }
  };

  const setLaterMovies = laterMovies => {
    localStorage.setItem("laterMovies", JSON.stringify(laterMovies))
    dispatch({ type: SET_LATER_MOVIES, value:laterMovies });
  }

  const removeLaterMovie = id => {
    axios.delete(`/api/${state.user.name}/latermovies`, { data: { "id": id } })
    .then(response => {
      setLaterMovies(response.data.later_movies)
    })
    .catch(error => {console.log(error)})
  };

  const setFavoriteMovies = favoritedMovies => {
    localStorage.setItem("favoritedMovies", JSON.stringify(favoritedMovies))
    dispatch({ type: SET_FAVORITE_MOVIES, value:favoritedMovies });
  };

  const removeFavoritedMovie = id => {
    axios.delete(`/api/${state.user.name}/favmovies`, { data: { "id": id } })
    .then(response => {
      setFavoriteMovies(response.data.favorited_movies)
    })
    .catch(error => {console.log(error)})
  };

  const setFriends = friends => {
    dispatch({ type: SET_FRIENDS, value: friends });
  };

  const setGroup = group => {
    if (state.group.length === 1 && group.length === 0 ) {
      getGenres();
      setTheme(false);
    }
    localStorage.setItem("group", JSON.stringify(group))
    dispatch({ type: SET_GROUP, value: group });
  };

  const setTheme = value => {
    dispatch({ type: SET_THEME, value: value });
  }

  return { state, setUser, getGenres, setGenres, setLaterMovies, removeLaterMovie, setFriends, setGroup, setFavoriteMovies, removeFavoritedMovie, setTheme };
};
