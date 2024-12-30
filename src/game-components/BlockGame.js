import { Col, Row } from "react-bootstrap";
import Board from "./Board";
import SideMenu from "./SideMenu";
import { useContext, useEffect } from "react";
import Actions from "./Actions";
import { Context } from "../App";
import Block from "./Block";

export default function BlockGame() {

   const { setSequences, sequenceIndex } = useContext(Context);

   useEffect(() => {
      generateSequences();
   }, []);

   function checkSequencePattern(sequence) {
      let sequenceApproved = true;
      let patternApproved = false;
      const patterns = ['013', '1024', '215', '3046', '41357', '5248', '637', '7468', '857'];

      for (let seqIndex = 0; seqIndex < sequence.length; seqIndex++) {
         const sequenceNum = sequence[seqIndex];
         let pattern = patterns[sequenceNum];
         pattern = pattern.replace(sequenceNum, "");
         let containsCount = 0;
         for (let patternIndex = 0; patternIndex < pattern.length; patternIndex++) {
            if(sequence.includes(pattern[patternIndex]))
               containsCount++;
         }
         if (containsCount === 0)
            sequenceApproved = false;

         if (containsCount > 1) 
            patternApproved = true;
      }
      return sequence.length > 3 ? sequenceApproved && patternApproved : sequenceApproved;
   }

   function generateSequences() {
      let sequenceList = [];
      for (let index = 0; index < 3; index++) {
         sequenceList.push(generateSequence());
      }
      setSequences(sequenceList);
   }

   function generateSequence() {
      let seqGenerating = true;
      while (seqGenerating) {
         const randomNumber = Math.round(Math.random() * 10000);
         const blockIndexes = [...new Set(randomNumber.toString().split("").filter((key) => Number(key) < 9))]
                                 .map(Number).sort((a, b) => a - b);
         const generatedSequence = blockIndexes.join("");
         if (generatedSequence.length > 2) {
            if (checkSequencePattern(generatedSequence)) {
               seqGenerating = false;
               return generatedSequence;
            }
         }
      }
   }

   return(
      <Row>
         <Col md={3} className="timer">
            <SideMenu/>
            <Block size={'medium-block'} index={sequenceIndex}/>
            <Actions/>
         </Col>
         <Col md={6} className="set-end bg-theme">
            <Board generateSequence={generateSequence}/>
         </Col>
         <Col md={3} style={{padding: '25px 0px'}} className="bg-theme">
            <Block size={'small-block'} index={0}/>
            <Block size={'small-block'} index={1}/>
            <Block size={'small-block'} index={2}/>
         </Col>
      </Row>
   );
}