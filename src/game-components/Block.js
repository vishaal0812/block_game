import { useContext } from "react";
import { Context } from "../App";

export default function Block({ size, index }) {

   const { sequenceIndex, sequences, setSequenceIndex, blockAvailablity } = useContext(Context);
   const sequence = sequences[index];

   const BoardRow = () => {
      let board = [];
      let count = 0;
      if (sequence) {
         for (let rowindex = 0; rowindex < 3; rowindex++) {
            let row = [];
            for (let columnIndex = 0; columnIndex < 3; columnIndex++) {
               const countContains = sequence.includes(count);
               row.push(
                  <div
                     id={count}
                     key={count}
                     className={`${size} ${countContains ? "exist-block" : "empty-block"}`}
                  />
               );
               count++;
            }
            board.push(<div key={rowindex} className="set-center">{row}</div>);
         }
      }
      return <div>{board}</div>;
   };

   return (
      <div className={`set-center my-3 ${!blockAvailablity[index] && ' opacity-04'}`}>
         <div 
            className={`small-board ${sequenceIndex === index && 'selected-box'}`} 
            onClick={() => {
               blockAvailablity[index] && setSequenceIndex(index)
            }}
         >
            <BoardRow />
         </div>
      </div>
   );
}
