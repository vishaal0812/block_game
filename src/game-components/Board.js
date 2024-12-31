import React, { useContext, useEffect, useState } from "react";
import { Context } from "../App";

export default function Board({ generateSequence }) {
   
   const { setScore, pause, setGameOver, placedBlocks, setPlacedBlocks, sequenceIndex, 
      sequences, setSequences, setBlockAvailablity, setSequenceIndex } = useContext(Context);
   const [hoverBlocks, setHoverBlocks] = useState([]);
   const [filledLines, setFilledLines] = useState([]);

   useEffect(() => {
      if (filledLines.length > 0) {
         const interval = setInterval(() => {
            setFilledLines(preValue => {
               const updateFilledLines = preValue.map(item => item.slice(1)).filter(item => item.length > 0);
               return updateFilledLines;
            })
            setPlacedBlocks(preValue => {
               const placedIndexes = preValue;
               filledLines.forEach(filledLine => {
                  delete placedIndexes[filledLine[0]];
               })
               return placedIndexes;
            })
         }, 100);
         
         return () => clearInterval(interval);
      } else {
         checkGameOver(sequences, placedBlocks);
      }
   }, [filledLines]);
   

   function handleHoverBlock(startIndex) {
      const boardIndexes = getBlockIndex(startIndex, sequences[sequenceIndex]);
      if(sequences[sequenceIndex].length === boardIndexes.length) {
         setHoverBlocks(boardIndexes);
      }else setHoverBlocks([]);
   }

   function handlePlaceBlock() {
      const nonExistBlock = hoverBlocks.some(index => placedBlocks[index] || index > 80);
      if (hoverBlocks.length === sequences[sequenceIndex].length && !nonExistBlock) {
         let filledBlocks = { ...placedBlocks };
         for (let index = 0; index < hoverBlocks.length; index++) {
            const blockIndex = hoverBlocks[index];
            filledBlocks[blockIndex] = true;
         }
         
         const sequenceList = [...sequences];
         checkCompletedLines(sequenceList, filledBlocks);
         sequenceList[sequenceIndex] = generateSequence();
         setSequences(sequenceList);
      }
   }

   function checkCompletedLines(sequenceList, filledBlocks) {
      let filledLines = [];
      for (let rowIndex = 0; rowIndex < 9; rowIndex++) {
         let filledRow = [];
         let filledColumn = [];
   
         for (let columnIndex = 0; columnIndex < 9; columnIndex++) {
            const rowKey = rowIndex * 9 + columnIndex;
            if (filledBlocks[rowKey] !== undefined) {
               filledRow.push(rowKey);
            }
            const columnKey = columnIndex * 9 + rowIndex;
            if (filledBlocks[columnKey] !== undefined) {
               filledColumn.push(columnKey);
            }
         }
         if (filledRow.length === 9) {
            filledLines.push(filledRow);
            setScore(score => score + 100);
         }
            
         if (filledColumn.length === 9) {
            filledLines.push(filledColumn);
            setScore(preScore => preScore + 100);
         }
      }
      setPlacedBlocks(filledBlocks);
      setFilledLines(filledLines);
      // generateSequence();
      if (filledLines.length === 0)
         checkGameOver(sequenceList, filledBlocks);
   }

   function checkGameOver(sequenceList, filledBlocks) {
      if (sequenceList.length > 0) {
         let placeableBlocks = [false, false, false];
         for (let seqIndex = 0; seqIndex < sequenceList.length; seqIndex++) {
            let placeIsThere = false;
            for (let index = 0; index < 80 ; index++) {
               if (!placedBlocks[index] && !placeIsThere) {
                  const availableBlocks = getBlockIndex(index, sequenceList[seqIndex]);
                  const nonExistBlock = availableBlocks.some(boardIndex => filledBlocks[boardIndex]);
                  if(availableBlocks.length === sequenceList[seqIndex].length && !nonExistBlock) {
                     placeIsThere = true;
                     placeableBlocks[seqIndex] = true;
                     setSequenceIndex(seqIndex);
                  }
               }
            }
         }
         setBlockAvailablity(placeableBlocks);
         const gameRunning = placeableBlocks.some(availability => availability === true);
         setGameOver(!gameRunning && 'Game Over');
      }
   }

   function getBlockIndex(startIndex, sequence) {
      let boardIndexes = [startIndex];
      const patterns = ['036', '147', '258'];
      for (let seqIndex = 0; seqIndex < sequence.length -1; seqIndex++) {
         const num1 = Number(sequence[seqIndex]), num2 = Number(sequence[seqIndex + 1]);
         if (num1 + 1 === num2 && num2 % 3 === 0) {
            boardIndexes.push(boardIndexes[boardIndexes.length - 1] + 7);
         }else if (num1 + 1 === num2) {
            const placedIndex = boardIndexes[boardIndexes.length - 1] + 1;
            if (placedIndex % 9 !== 0)
            boardIndexes.push(boardIndexes[boardIndexes.length - 1] + 1);
         }else {
            const pattern = patterns.filter(pattern => pattern.includes(num1));
            if (pattern[0].includes(num2)) {
               boardIndexes.push(boardIndexes[boardIndexes.length - 1] + 9);
            }else {
               boardIndexes.push(boardIndexes[boardIndexes.length - 1] + 8);
            }
         }
      }
      boardIndexes = boardIndexes.filter(index => index <= 80);
      return boardIndexes;
   }
   

   const GameBoard = () => {
      let board = [];
      let count = 0;
      for (let rowIndex = 0; rowIndex < 9; rowIndex++) {
         let row = [];
         for (let columnIndex = 0; columnIndex < 9; columnIndex++) {
            const blockContains = hoverBlocks.includes(count);
            const blockPlaced = placedBlocks[count];
            row.push(
               <div 
                  id={count}
                  key={count}
                  className={"big-block " + 
                     ((blockContains || blockPlaced && !pause) ? "exist-block " : "empty-block ") +
                     (blockContains && "opacity-06 ") +
                     ((blockContains && blockPlaced) && "error-block " )
                  }
                  onClick={() => {
                     if (!pause) handlePlaceBlock();
                  }}
                  onMouseEnter={(event) => {
                     const boardIndex = parseInt(event.currentTarget.id);
                     if (!pause && hoverBlocks[0] !== boardIndex) {
                        handleHoverBlock(boardIndex);
                     }
                  }}
               />
            );
            count++;
         }
         board.push(
            <div key={rowIndex} className="d-flex justify-content-center">
               {row}
            </div>
         );
      }
      return <div>{board}</div>;
   };

   return (
      <div className="board" onMouseOut={() => setHoverBlocks([])}>
         <GameBoard/>
      </div>
   );
}
