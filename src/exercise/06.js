// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'
import {fetchPokemon, PokemonForm, PokemonInfoFallback, PokemonDataView} from '../pokemon';
import {ErrorBoundary} from "react-error-boundary";

// Custom error boundary class
/*class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, errorInfo) {
    window.console.error("An unexpected error occurs in the application:", error, errorInfo)
  }

  render() {
    const { error } = this.state;
    if (error) {
      return <this.props.FallbackComponent error={error} />;
    }

    return this.props.children;
  }
}*/

const STATUS = {
  IDLE: "idle",
  PENDING: "pending",
  RESOLVED: "resolved",
  REJECTED: "rejected",
}

function PokemonInfo({pokemonName}) {
  const [state, setState] = React.useState({
    pokemon: null,
    status: pokemonName ? STATUS.PENDING : STATUS.IDLE,
    error: null,
  });
  const {status, pokemon, error} = state;

  React.useEffect(() => {
    if (!pokemonName) return;
    setState((prevState) => ({ ...prevState, status: STATUS.PENDING }));
    fetchPokemon(pokemonName)
      .then(
        (pokemonData) => {
          setState((prevState) => ({ ...prevState, pokemon: pokemonData, status: STATUS.RESOLVED}));
        },
        (error) => {
          setState((prevState) => ({ ...prevState, error: error, status: STATUS.REJECTED}));
        })
  }, [pokemonName]);

  if (status === STATUS.IDLE) {
    return "Submit a pokemon";
  }

  if (status === STATUS.PENDING) {
    return <PokemonInfoFallback name={pokemonName} />;
  }

  if (status === STATUS.RESOLVED) {
    return <PokemonDataView pokemon={pokemon} />;
  }

  if (status === STATUS.REJECTED) {
    // this will be handled by our error boundary
    throw error;
  }

}

function ErrorFallback({error, resetErrorBoundary}) {
  return (
    <div role="alert">
      There was an error: <pre style={{whiteSpace: 'normal'}}>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  )
}

function App() {
  const [pokemonName, setPokemonName] = React.useState("")

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  function handleReset() {
    setPokemonName("");
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <ErrorBoundary
          FallbackComponent={ErrorFallback}
          onReset={handleReset}
          resetKeys={[pokemonName]}
        >
          <PokemonInfo pokemonName={pokemonName} />
        </ErrorBoundary>
      </div>
    </div>
  )
}

export default App
