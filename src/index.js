import Card from "./scripts/card.js"
import Deck from "./scripts/deck.js"
import Calculator from "./scripts/calculator.js"
import View from "./scripts/view.js";
import Control from "./scripts/control.js";

document.addEventListener("DOMContentLoaded", ()=>{
//   console.log("hi");
//   const main = document.getElementById("main-container");
//   new Test(main)
  const view = new View();

  const sideCardsEl = document.querySelector(".side-cards");
  view.setupSideCards(sideCardsEl);

  const boardCardsEl = document.querySelector(".board-cards");
  view.setupBoardCards(boardCardsEl);

  const holeCardsEl = document.querySelector(".hole-cards");
  view.setupHoleCards(holeCardsEl);

  const rangeCardsEl = document.querySelector(".range");
  view.setupRange(rangeCardsEl);

  // let haha = document.querySelectorAll("li");
  // console.log(haha);

  const control = new Control(view);
  console.log(control.positions);
  console.log(control.list)
  window.control = control;





  // using canvas to draw a poker table
  const canvasEl = document.getElementById("main-canvas");
  canvasEl.width = window.innerWidth;
  canvasEl.height = window.innerHeight;
  const ctx = canvasEl.getContext("2d");

  // draw oval table
  ctx.beginPath();
  ctx.ellipse(canvasEl.width * 0.5, canvasEl.height * 0.5,200,300, Math.PI/2, 0, 2*Math.PI);
  ctx.stroke();
  ctx.fillStyle = "green";
  ctx.fill();

  //

  const deck = new Deck();
  // console.log(deck);
  window.deck = deck;

  const calculator = new Calculator();
  // console.log(calculator);
  window.calculator = calculator;






  //for testing
  let c1 = new Card("A", "diamond");
  let c2 = new Card("A", "club");

  let c3 = new Card("K", "diamond");
  let c4 = new Card("K", "club");

  let d1 = new Card("2", "diamond");
  let d2 = new Card("2", "club");
  let d3 = new Card("3", "diamond");
  let d4 = new Card("2", "heart");
  let d5 = new Card("2", "spade");

  let c5 = new Card("J", "spade");
  let c6 = new Card("Q", "spade");

  let c7 = new Card("10", "diamond");
  let c8 = new Card("10", "heart");

  const h1 = [c1, c2, c3, c4, c5, d1, d2];
  const board1 = [d1, d2, d3, d4, d5];
  const hand1 = [c1, c2];
  const hand2 = [c3, c4]
  const range1 = [[c3, c4], [c5, c6], [c7, c8], [c5, c7]]
  // console.log(hand1);
  // console.log(hand2);
  // console.log(board1);
  window.range1 = range1;
  window.h1 = h1;
  window.board1 = board1;
  window.hand1 = hand1;
  window.hand2 = hand2;

  
});