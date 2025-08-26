import { useState } from "react";
import { useMovies } from "../custom-hooks/useMovies";
import { useLocalStorageState } from "../custom-hooks/useLocalStorageState";
import { Loader } from "./Loader";
import { ErrorMessage } from "./ErrorMessage";
import { Search } from "./Search";
import { NavBar } from "./NavBar";
import { NumResults } from "./NumResults";
import { Box } from "./Box";
import { MovieList } from "./MovieList";
import { WatchedMoviesList } from "./WatchedMoviesList";
import { WatchedSummary } from "./WatchedSummary";
import { MovieDetails } from "./MovieDetails";

export const apiKey = process.env.REACT_APP_OMDB_API_KEY;

export const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

export default function App() {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const { movies, isLoading, error } = useMovies(query); // Custom hook

  const [watched, setWatched] = useLocalStorageState([], 'watched'); // Custom hook
  
  function handleSelectMovie(id) {
    setSelectedId(selectedId => id === selectedId ? null : id);
  }

  function handleCloseMovie() {
    setSelectedId(null);
  }

  function handleAddWatched(movie) {
    setWatched((watched) => [...watched, movie]);

    // localStorage.setItem('watched', JSON.stringify([...watched, movie]));
  }

  function handleDeleteWatched(id) {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
  }


  return (
    <>
      <NavBar>
        <Search query={query} setQuery={setQuery} />
        <NumResults movies={movies} />
      </NavBar>
      
      <Main>
        <Box>
          {/* {isLoading ? <Loader /> : <MovieList movies={movies} />} */}
          {isLoading && <Loader />}
          {!isLoading && !error && <MovieList 
                                      movies={movies} 
                                      onSelectMovie={handleSelectMovie}
                                      onCloseMovie={handleCloseMovie}
                                      />}
          {error && <ErrorMessage message={error} />}
        </Box>
        
        <Box>
          {selectedId ? (
            <MovieDetails 
              selectedId={selectedId} 
              watched={watched}
              onCloseMovie={handleCloseMovie} 
              onAddWatched={handleAddWatched}
            />
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <WatchedMoviesList watched={watched} onDeleteWatched={handleDeleteWatched} />
            </>
          )}
        </Box>
      </Main>    
    </>
  );
}

function Main({ children }) {
  return (
    <main className="main">
      { children }
    </main>
  );
}