import './App.css';
import BlockGame from './game-components/BlockGame';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { createContext, useState } from 'react';

function App() {
  
  const [sequence, setSequence] = useState('');
  const [pause, setPause] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);  
  const [gameOver, setGameOver] = useState();
  const [placedBlocks, setPlacedBlocks] = useState({});
  const [time, setTime] = useState({ minutes: 10, seconds: 0});
  const [sequences, setSequences] = useState({});
  const [sequenceIndex, setSequenceIndex] = useState(0);
  const [blockAvailablity, setBlockAvailablity] = useState([true, true, true]);

  return (
    <div className="App">
      <Context.Provider 
        value={{
          time,
          sequence,
          pause,
          score,
          highScore,
          gameOver,
          placedBlocks,
          sequences,
          sequenceIndex,
          blockAvailablity, 
          setTime,
          setSequence,
          setPause,
          setScore,
          setHighScore,
          setGameOver,
          setPlacedBlocks,
          setSequences,
          setSequenceIndex,
          setBlockAvailablity
        }}>
        <BlockGame/>
      </Context.Provider>
    </div>
  );
  }
export const Context = createContext();

export default App;
