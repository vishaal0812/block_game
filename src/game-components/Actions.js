import { useContext } from "react";
import { Button, Modal } from "react-bootstrap";
import { Context } from "../App";
import ReactConfetti from "react-confetti";
import { Label } from "../assets/labels/Label";

export default function Actions() {

   const { pause, setPause, score, setScore, highScore, 
      setPlacedBlocks, setBlockAvailablity, setTime, gameOver, setGameOver } = useContext(Context);
   const showModal = gameOver || pause;
   const isHighScore = score === highScore && highScore !== 0;
   const highScorePop = isHighScore && gameOver;


   const gameOverModal = (
      <Modal show={showModal} centered>
         {highScorePop && <ReactConfetti height={230} width={480}/>}
         <Modal.Body>
            <h1 className="set-center" style={{color: '#fff'}}>{pause? 'RESUME' : gameOver}</h1>
            <h4 className="set-center score">
               {isHighScore && <i className={"mx-1 fa fa-star"}/>}{Label.SCORE}: {score}
            </h4>
            <h5 className="set-center score">
               <i className={"mx-1 fa fa-trophy"}/>{isHighScore && 'New '}{Label.HIGH_SCORE}: {highScore}
            </h5>
            <div className="set-center">
               <Button 
                  className="mx-1 game-button transparent-bg" 
                  onClick={() => {
                     setScore(0);
                     setPlacedBlocks({});
                     setTime({ minutes: 10, seconds: 0})
                     setGameOver(null);
                     setPause(false);
                     setBlockAvailablity(Array(3).fill(true));
                  }}>
                  <i className="mx-1 fa fa-rotate-right"/>{Label.PLAY_AGAIN}
               </Button>
               {pause && <Button 
                  className="mx-1 game-button transparent-bg"
                  onClick={() => setPause(false)}
               >
                  <i className={"mx-1 fa fa-play"}/>{Label.RESUME}
               </Button>}
            </div>
         </Modal.Body>
      </Modal>
   );
    
   return(
      <div className="my-4">
         {gameOverModal}
         <Button 
            className="mx-1 game-button" 
            onClick={() => {
               setScore(0);
               setPlacedBlocks({});
               setTime({ minutes: 10, seconds: 0})
            }}>
            <i className="mx-1 fa fa-rotate-right"/>{Label.RESTART}
         </Button>
         <Button 
            className="mx-1 game-button"
            onClick={() => setPause(!pause)}
         >
            <i className="mx-1 fa fa-pause"/>{Label.PAUSE}
         </Button>
      </div>
   );
}