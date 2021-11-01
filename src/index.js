import Card from "./scripts/card.js"
import Deck from "./scripts/deck.js"
import Calculator from "./scripts/calculator.js"

document.addEventListener("DOMContentLoaded", ()=>{
//   console.log("hi");
//   const main = document.getElementById("main-container");
//   new Test(main)

  // using canvas to draw a poker table
  const canvasEl = document.getElementById("main-canvas");
  const ctx = canvasEl.getContext("2d");

  // draw oval table
  ctx.beginPath();
  ctx.ellipse(400,300,200,300, Math.PI/2, 0, 2*Math.PI);
  ctx.stroke();
  ctx.fillStyle = "green";
  ctx.fill();

  //

  const deck = new Deck();
  console.log(deck);
  window.deck = deck;

  const calculator = new Calculator();
  console.log(calculator);
  window.calculator = calculator;

  //for testing
  let c1 = new Card("3", "♦");
  let c2 = new Card("7", "♦");

  let c3 = new Card("K", "♦");
  let c4 = new Card("10", "♦");

  let d1 = new Card("5", "♦");
  let d2 = new Card("6", "♣");
  let d3 = new Card("A", "♦");
  let d4 = new Card("8", "♦");
  let d5 = new Card("9", "♠");

  let c5 = new Card("J", "♦♣♥♠");
  const h1 = [c1, c2, c3, c4, c5, d1, d2];
  const board1 = [d1, d2, d3, d4, d5];
  const hand1 = [c1, c2];
  const hand2 = [c3, c4]
  console.log(hand1);
  console.log(hand2);
  console.log(board1);
  window.h1 = h1;
  window.board1 = board1;
  window.hand1 = hand1;
  window.hand2 = hand2;

  
});