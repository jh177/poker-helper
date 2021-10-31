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
  let c1 = new Card("7", "♦");
  let c2 = new Card("8", "♣");
  let c3 = new Card("9", "♥");
  let c4 = new Card("10", "♠");
  let c5 = new Card("K", "♦");
  let d1 = new Card("7", "♦");
  let d2 = new Card("8", "♣");
  let d3 = new Card("9", "♥");
  let d4 = new Card("7", "♠");
  let d5 = new Card("K", "♦");
  const h1 = [c1, c2, c3, c4, c5];
  const h2 = [d1, d2, d3, d4, d5];
  console.log(h1);
  console.log(h2);
  window.h1 = h1;
  window.h2 = h2;
});