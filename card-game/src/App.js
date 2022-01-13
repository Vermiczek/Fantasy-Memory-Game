import { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import redux, {
  setDeck,
  setCard,
  selectDeck,
  setRefresh,
  selectRefresh,
  selectFlipped,
  selectWanted,
  setFlipped,
  setWanted,
  setGameover,
  selectGameover
} 
from './redux.js';
import './styles/CardsTable.scss';
import cardTypes from './cardTypes'

const monsterName=(cardType)=>{
  var monster = '';
  if(cardType==0)
  {
    monster ="scorpion";
  }
  if(cardType==1)
  {
    monster ="sphinx";
  }
  if(cardType==2)
  {
    monster ="centipede";
  }
  if(cardType==3)
  {
    monster ="lion";
  }
  if(cardType==4)
  {
    monster ="worm";
  }
  if(cardType==5)
  {
    monster ="dragon";
  }
  if(cardType==6)
  {
    monster ="muaddib";
  }
  if(cardType==7)
  {
    monster ="desertsnake";
  }
  if(cardType==8)
  {
    monster ="elemental";
  }
  if(cardType==9)
  {
    monster ="finek";
  }
  if(cardType==10)
  {
    monster ="wolf";
  }
  return monster;
}

const Card = (props)=>{
  const dispatch = useDispatch();
  const [cardID, setID] = useState(props.cardData.card.id);
  const [cardFlipped, setFlipped] = useState(props.cardData.card.flipped);
  const [cardType, setType] = useState(props.cardData.card.type);

  useEffect(()=>{
  }, [])
  
  useEffect(()=>{
     setID(props.cardData.card.id);
     setFlipped(props.cardData.card.flipped);
     setType(props.cardData.card.type);
  }, [props.cardData])


  const flipCard=()=>{
    if(!cardFlipped){
    setFlipped(true);
    dispatch(setCard({card:{id:cardID, type: cardType, flipped: cardFlipped}}));}

    if(cardFlipped) console.log("Card already flipped");
  }



  if(!cardFlipped)
    return (<div className="card" onClick={()=>flipCard()}><div className="card-back"></div></div>);
  else
    return (<div className="card" onClick={()=>flipCard()}><div className={monsterName(cardType)}></div></div>);
}

const WantedCardView = (props)=>{
  const wantedCard = useSelector(selectWanted);
  const [cardType, setType] = useState(wantedCard);
  
  useEffect(()=>{
    setType(wantedCard);
  }, [wantedCard])

  return (<div className="card"><div className={monsterName(cardType)}></div></div>);
}


//Map of all cards in play//
const CardTable = (props)=>{
  //console.log(props.refresh)
   const reduxDeck = useSelector(selectDeck);
   const reduxRefresh = useSelector(selectRefresh);
   const dispatch = useDispatch();
   const rowMaxSize = 5;
   const [rowMap, setMap] = useState([]);
   const firstRefresh = useRef(true);
   
   

  useEffect(()=>{
    if(!firstRefresh.current){
    let sizeOfRowArray = Math.ceil(reduxDeck.cards.length/5);
   var rowArray = [];

   for(let i = 0; i<(sizeOfRowArray); i++)
   {
  
     rowArray.push({rowIndex: i});
   }
   var map = rowArray.map((row) => {
    var arrayOfCards = [];
    let loopIdx = row.rowIndex*rowMaxSize;
    for(loopIdx; loopIdx<(row.rowIndex*rowMaxSize+rowMaxSize); loopIdx++)
    {
      
       arrayOfCards.push(reduxDeck.cards[loopIdx]);
       if(loopIdx+1>=reduxDeck.cards.length)
          break;
    }
    return (<CardRow key={row.rowIndex} array={arrayOfCards}/>);
  });
   
   setMap(map);
   dispatch(setRefresh(false));
  }
   else{
     //console.log("First refresh");
     firstRefresh.current = false;
   }
}, [reduxRefresh]);

 
  
  

  return (<div className="card-table"><div className="card-table-cards"><div style={{display:"flex", allignItems: "center"}}><WantedCardView /><div style={{height:"100%"}}></div></div>{rowMap}</div></div>);

}

const CardRow = (props)=>{
   const reduxRefresh = useSelector(selectRefresh);
   const [cardsArray, setCardsArray] = useState([]);
   useEffect(()=>{
    let map = props.array.map((card, id) => {
      return (<Card key={id} cardData={card}/>);
    });
    setCardsArray(map);
   }, [reduxRefresh])

   let map = props.array.map((card, id) => {
    return (<Card key={id} cardData={card}/>);
  });

  return (<div className="card-row">{cardsArray}</div>);
}


//App wrapping the whole game//
const App = ()=>{
  const reduxDeck = useSelector(selectDeck);
  const dispatch = useDispatch();
  const firstFlip = useRef(false);
  const wantedCard = useSelector(selectWanted);
  const flippedCard = useSelector(selectFlipped);
  const [cardsPerType, setCardsPerType] = useState(2);
  const [roundCount, setRound] = useState(1);
  const [cardTypeTable, setCardTypeTable] = useState(Object.assign({},cardTypes.types));
  const [highScore, setHighScore] = useState(1);

  useEffect(()=>{
    if(roundCount>highScore){
      setHighScore(roundCount);
    }

  }, [roundCount])
   

  const cardTableLength = ((table)=>{
    try{
    var sum = 0;
    console.log(table[0].type.amount);
    for(let i = 0; i<=10; i++)
    {
      sum=sum+table[i].type.amount;
      console.log(table[i].type.amount);
    }
    return sum;}
    catch{
      return 0
    }
  })

  const setWantedCard = ((table)=>{
    var randomNumber = null;



    while(randomNumber === null || (table[randomNumber].type.amount<=0)){
       randomNumber = Math.floor(Math.random() * 10);
    } 
     dispatch(setWanted(randomNumber));
  
  } )

  const evaluateCard = (()=>{
    console.log(flippedCard.type);
    console.log(wantedCard);
    if(flippedCard.type==wantedCard){ 
      removeCardFromTypeTable(flippedCard.type);
      console.log("Length: "+cardTableLength(cardTypeTable));
      console.log(cardTypeTable);
      if((cardTableLength(cardTypeTable))<=0)
      {
         setRound(roundCount+1);
         firstFlip.current=true;
      }}
    else{
      firstFlip.current=true;
      if(roundCount==1)
      {
        setNewDeck();
        setWantedCard(cardTypeTable);
      }
      else
      setRound(1);
    }
})
   

  const removeCardFromTypeTable =(typeID)=>
  {
    let table = Object.assign({},cardTypeTable);
    table[typeID].type.amount-=1;
    setCardTypeTable(table);
    console.log("Table2: ");
    console.log(table);
  }

  const makeDeck = (()=>
{
  console.log("Remake deck");
  let cardTypeGeneratorTable = Object.assign({},cardTypeTable);
  for(let i = 0; i<10; i++)
  {
    cardTypeGeneratorTable[i].type.amount = 0;
  }
  let array = []
  let cardAmount = Math.floor(roundCount/2+2)
  dispatch(setRefresh(true));
  for(var i = 0; i<cardAmount; i++)
  {  
  
    var randomNumber = null;

    while(randomNumber === null || (cardTypeGeneratorTable[randomNumber].type.amount>cardsPerType)){
    
       randomNumber = Math.floor(Math.random() * 10)
    } 
     cardTypeGeneratorTable[randomNumber].type.amount = cardTypeGeneratorTable[randomNumber].type.amount +1;
     array.push({card:{id:i,type:randomNumber,flipped:true}});
     setCardTypeTable(cardTypeGeneratorTable);
  }
  setWantedCard(cardTypeGeneratorTable);
  firstFlip.current=true;
  return { deck:
    {
    cards:array
    } }})

const setNewDeck = ()=>{
  dispatch(setDeck(makeDeck()));
  setWantedCard(cardTypeTable);
  
}

useEffect(()=>{
   setNewDeck();
   setWantedCard(cardTypeTable);
   
}, [roundCount]);

useEffect(()=>{if(firstFlip.current==true)
  setTimeout(() => {
  var deckArray = [];
  try{
  for(var i = 0; i<reduxDeck.cards.length; i++)
  {
    deckArray.push({card:{id:reduxDeck.cards[i].card.id,type:reduxDeck.cards[i].card.type,flipped:false}});
  }
  var deck={ deck:
    {
    cards:deckArray 
    } }
  console.log(deck);
  firstFlip.current=false;
  dispatch(setDeck(deck));
  dispatch(setRefresh(true));
}
catch{
  console.log("couldnt flip cards");
}
  //dispatch(setDeck(deck));
}, ((Math.floor(roundCount/2+2))*1000));
}, [reduxDeck]);

useEffect(()=>{
  setWantedCard(cardTypeTable);
},[cardTypeTable])

useEffect(()=>{
  if(flippedCard!==null)
  {
    evaluateCard();
  }
}, [flippedCard]);

  

  let size = 10;
  
  return (
    <div className="wrapper">
    <div className="App">
      <SideBar round = {roundCount} hiscore={highScore}/>
      <CardTable size={size} refresh={roundCount}/>
    </div>
    </div>
  );
}

const CardHistory=({array})=>{
  const [cardMap, setCardMap] = useState([]);
  const [cardArray, setArray] = useState([]);
  const flippedCard = useSelector(selectFlipped);

  const wantedCard = useSelector(selectWanted);
  useEffect(()=>{
  try{
  let map = cardArray.map((card, id) => {
    return (<FlippedCardView card={card}/>);
  });
  setCardMap(map);
  console.log('Mapped!')
}
  catch{
    console.log("Couldnt map")
  }})

  useEffect(()=>{
    setArray(array.slice(0).reverse());
    console.log("new array!")
  })

  useEffect(()=>{
  console.log("History array")
   let rev = array;
   rev = rev.slice(0).reverse();
   console.log(rev);
   console.log(array);
   console.log("History map");
   console.log(cardMap);
  })


  if(cardMap!='')
  return (<div>{cardMap}</div>);
  else
  return (<div></div>)
}

const FlippedCardView = ({card})=>{
  const [cardType, setType] = useState(card.type);
  useEffect(()=>{
    setType(card.type);
  }, [card])
  
  return (<div className="card"><div className={monsterName(cardType)}></div></div>);
}


const SideBar=(props)=>{
  const flipped = useSelector(selectFlipped);
  var [roundString, setScoreString] = useState('');
  var [hiscoreString, setHiscoreString] = useState('');
  var [savedCards, setSavedCards] = useState([]);
  useEffect(()=>{
    if(flipped!==null){
    var helperarr = savedCards;
    helperarr.push(flipped);
    setSavedCards(helperarr);
  }
  },[flipped])

  useEffect(()=>{
    setScoreString("Score: " +props.round);
  }, [props.round])
  useEffect(()=>{
    setHiscoreString("High score: " +props.hiscore);
  }, [props.hiscore])


  return (
    <div className="sideBar">
    <div className="score">{roundString}</div>
    <div className="hiscore">{hiscoreString}</div>
    <CardHistory array={savedCards}/>
    </div>
  )
}

export default App;
