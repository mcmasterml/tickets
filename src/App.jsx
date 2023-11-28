import { useState } from 'react';
// import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Data from './apiCall.jsx';
import './App.css';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>Hi World!</div>
      <button onClick={() => setCount(count + 1)}>{count}</button>
      <Data />
    </>
  )
}

export default App
