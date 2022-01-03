import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  setDeck,
  setCard,
  selectDeck,
  incrementRound
} 
from './redux.js';
import './styles/CardsTable.scss';


const Card = (props)=>{
    return (<div className="card"></div>);
}


//Map of all cards in play//
const CardTable = (props)=>{
   const rowMaxSize = 5;
   const xd = "xd"; 
   const cardTable = [xd, xd, xd, xd, xd, xd, xd, xd, xd, xd]

   const [rowsArray, setRowsArray] = useState([]);
   const [roundNumber, setRoundNumber] = useState(0);
   const [amountOfCards, setAmountOfCards] = useState(2);

   useEffect(()=>{
    setRoundNumber(props.roundNumber);
  },
  [props.roundNumber]);

   const CalculateAmountOfCards=()=>{
     let amount = roundNumber/2; 
   }
   
   let sizeOfRowArray = Math.ceil(cardTable.length/5);
   var rowArray = [];
   
   for(let i = 0; i<(sizeOfRowArray); i++)
   {
     rowArray.push({rowIndex: i});
   }

let map = rowArray.map((row) => {
    var array = [];
    let loopIdx = row.rowIndex*rowMaxSize;
    for(loopIdx; loopIdx<(row.rowIndex*rowMaxSize+rowMaxSize); loopIdx++)
    {
       array.push(cardTable[loopIdx]);
       if(loopIdx+2>=cardTable.length)
          break;
    }
    return (<CardRow array={array}/>);
  });
   

  
  

  return (<div className="card-table">{map}</div>);

}

const CardRow = (props)=>{
   const [cardsArray, setCardsArray] = useState([])
   useEffect(()=>{
     setCardsArray(props.array);
   })

   let map = cardsArray.map((choice, id) => {
    return (<Card key={id}/>);
  });

  return (<div className="card-row">{map}</div>);
}


//App wrapping the whole game//
const App = ()=>{
  const [createDeck, setCreate] = useState(0);
  const dispatch = useDispatch();
  const deck = useSelector(selectDeck);
  const [refresh, setRefresh] = useState(true);
  const [roundCount, setRefresh] = useState(10);
  const makeDeck = ()=>
{
  let array = []
  let cardAmount = Math.floor(roundCount/2+2)
  for(var i = 0; i<cardAmount; i++)
  {
     array.push({card:{id:i,type:0,flipped:false}});
  }
  return {deck:{cards:array}}
}


  if(createDeck<1){
    dispatch(setDeck(makeDeck()));
    setCreate(false);
    setCreate(createDeck+1)}
  console.log(deckxd);

  if(refresh==true)
  {
    setRefresh(false);
  }
  let size = 10;
  
  return (
    <div className="App">
      <CardTable size={size} roundNumber={size}/>
    </div>
  );
}

export default App;
