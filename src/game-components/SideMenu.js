import React, { useEffect, useContext } from "react";
import { Context } from "../App";

export default function SideMenu() {

   const { pause, gameOver, setGameOver, time, setTime, score, highScore, setHighScore } = useContext(Context);

   useEffect(() => {
      setHighScore(highScore => score > highScore ? score : highScore);
   }, [score])

   useEffect(() => {
      if (!pause && !gameOver) {
         const timer = setInterval(() => {
            if (time.minutes === 0 && time.seconds === 0) {
               clearInterval(timer); // Clear interval when time runs out
               setGameOver('Time out');
            } else if (time.seconds === 0) {
               setTime((prev) => ({
                  minutes: prev.minutes - 1,
                  seconds: 59,
               }));
            } else {
               setTime((prev) => ({ ...prev, seconds: prev.seconds - 1 }));
            }
         }, 1000);
   
         return () => clearInterval(timer);
      }
   }, [time, pause, gameOver]);
   

   return (
      <div className="set-center">
         <div>
            <h2 className="w-100 score" style={{fontSize: '45px'}}>BLOCK GAME</h2>
            <div className="my-4">
               <h4>
                  <i className="fa fa-clock score mx-1"/>
                  <span style={(time.minutes === 0 && time.seconds < 11) ? {color: '#ec0000'} : {}}>
                     TIME: {String(time.minutes).padStart(2, "0")}:
                     {String(time.seconds).padStart(2, "0")}
                  </span>
               </h4>
               <h4><i className="score fa fa-trophy mx-1"/>HIGH SCORE: {highScore || 0}</h4>
               <h4><i className="score fa fa-star mx-1"/>SCORE: {score}</h4>
            </div>
         </div>
      </div>
   );
}