// useEffect: persistent state
// http://localhost:3000/isolated/exercise/02.js

import * as React from 'react'

function useLocalStorageState(
  key,
  defaultValue = "",
  {
    serialize = JSON.stringify,
    deserialize = JSON.parse
  } = {}) {
  const [state, setState] = React.useState(
    () => {
      const valueInLocalStorage = window.localStorage.getItem(key);
      if (valueInLocalStorage) {
        return deserialize(valueInLocalStorage)
      }
      return typeof defaultValue === "function" ? defaultValue() : defaultValue;
    }
  )

  const prevKeyRef = React.useRef(key);

  React.useEffect(() => {
    const prevKey = prevKeyRef.current;
    if (prevKey !== key) {
      window.localStorage.removeItem(prevKey);
    }
    prevKeyRef.current = key;
    window.localStorage.setItem(key, serialize(state));
  }, [key, serialize, state]);

  return [state, setState]
}

function Greeting({initialName = "", keyName}) {
  const [name, setName] = useLocalStorageState(keyName, initialName);
  const [user, setUser] = useLocalStorageState("user", {firstName: "Federico"});

  function handleChange(event) {
    setName(event.target.value)
    setUser((prevUserState) => ({...prevUserState, lastName: "Viotti"}))
  }
  return (
    <div>
      <form>
        <label htmlFor="name">Name: </label>
        <input value={name} onChange={handleChange} id="name" />
      </form>
      <p>{name ? <strong>Hello {name}</strong> : 'Please type your name'}</p>
      <p>{user ? <strong>Hello {user.firstName} {user.lastName}</strong> : 'Please type your name'}</p>
    </div>
  )
}

function App() {
  const [keyName, setKeyName] = React.useState("name")
  const handleClick = () => setKeyName("new-name")
  return (<>
    <Greeting initialName="George" keyName={keyName}/>
    <button onClick={handleClick}>Change key name</button>
  </>)
}

export default App
