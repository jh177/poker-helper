import View from "./scripts/view.js";
import Control from "./scripts/control.js";
// import Card from "./scripts/card.js"
// import Deck from "./scripts/deck.js"
// import Calculator from "./scripts/calculator.js"

document.addEventListener("DOMContentLoaded", ()=>{
  const view = new View();
  const control = new Control(view);
  window.control = control;
  
  
  //for testing
  // const sideCardsEl = document.querySelector(".side-cards");
  // view.setupSideCards(sideCardsEl);

  // const boardCardsEl = document.querySelector(".board-cards");
  // view.setupBoardCards(boardCardsEl);

  // const holeCardsEl = document.querySelector(".hole-cards");
  // view.setupHoleCards(holeCardsEl);

  // const rangeEl = document.querySelector(".selected-range");
  // view.setupRangeCards(rangeEl);
  // view.setupRangeSelector(rangeEl);
  
  // const deck = new Deck();
  // // console.log(deck);
  // window.deck = deck;

  // const calculator = new Calculator();
  // console.log(calculator);
  // window.calculator = calculator;

  // let c1 = new Card("K", "diamond");
  // let c2 = new Card("A", "club");

  // let c3 = new Card("2", "heart");
  // let c4 = new Card("7", "diamond");

  // let d1 = new Card("K", "club");
  // let d2 = new Card("J", "club");
  // let d3 = new Card("2", "club");
  // let d4 = new Card("2", "spade");
  // let d5 = new Card("K", "heart");

  // let c5 = new Card("J", "spade");
  // let c6 = new Card("Q", "spade");

  // let c7 = new Card("10", "diamond");
  // let c8 = new Card("10", "heart");

  // const h1 = [c1, c2, d1, d2, d3, d4, d5];
  // const h2 = [c3, c4, d1, d2, d3, d4, d5]
  // const board1 = [d1, d2, d3, d4, d5];
  // const hand1 = [c1, c2];
  // const hand2 = [c3, c4]
  // const range1 = [[c3, c4], [c5, c6], [c7, c8], [c5, c7]]
  
  // window.range1 = range1;
  // window.h1 = h1;
  // window.h2 = h2;
  // window.board1 = board1;
  // window.hand1 = hand1;
  // window.hand2 = hand2;
});