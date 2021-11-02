import Calculator from "./calculator.js"
import Deck from "./deck.js"

class Control{
  constructor(view){
    this.view = view;
    this.bindPosEvents();
    // this.clickCard = this.clickCard.bind(this);
    this.bindListEvents();
    // this.clickList = this.clickList.bind(this);
    this.holeCards = [];
    this.boardCards = [];
    this.range = [];
    this.listCards = new Deck();
    this.cardToAdd = [];
    this.calculator = new Calculator();
    this.bindSimulateEvent();
  }

  bindPosEvents() {
    let positions = document.querySelectorAll(".hc, .fc, .tc, .rc, .range-card");
    this.positions = positions;
    // positions.forEach(pos=> pos.className += "haha");
    positions.forEach(pos=>{
      let that = this;
      pos.dataset.clickCount = "0";
      pos.addEventListener('click', that.clickCard.bind(that))});
  }

  clickCard(event) {
    let pos = event.target;
    pos.dataset.clickCount = parseInt(pos.dataset.clickCount) + 1;
    // console.log(pos);
    if (parseInt(pos.dataset.clickCount) % 2 === 0){
      this.addCard(pos);
    } 

    console.log(`hole cards: ${this.holeCards}`);
    console.log(`board cards: ${this.boardCards}`)
    console.log(`range cards: ${this.range}`)
    // else {
      // this.removeCard(pos);
      // this.addCardToList()
    // }
  }

  // add card to pos, remove from card list
  addCard(pos) {
    let cardPos = pos.dataset.pos
    let check = cardPos.substring(0,3);

    if (this.cardToAdd.length !== 0){
      let card = this.cardToAdd.pop();
      if (check === "hcP"){
        this.holeCards.push(card);
      } else if (check === "flo"){
        this.boardCards.push(card)
      } else if (check === "tcP"){
        this.boardCards.push(card);
      } else if (check === "rcP"){
        this.boardCards.push(card)
      } else if (check === "ran"){
        this.range.push(card);
      }
    }
  }
  //

  bindListEvents() {
    let list = document.querySelectorAll(".listed-card");
    this.list = list;
    list.forEach(pos => {
      let that = this;
      pos.dataset.clickCount = "0";
      pos.addEventListener('click', that.clickList.bind(that))});
  }

  clickList(event) {
    let card = event.target;
    // console.log(card);
    this.addListedCard(card);
    console.log(`card to add: ${this.cardToAdd}`);
  }

  addListedCard(card){
    let cardVal = card.dataset.value
    let cardSuit = card.dataset.suit
    console.log(cardVal, cardSuit);
    this.cardToAdd.push([cardVal, cardSuit]);
  }


  bindSimulateEvent() {
    let simulate = document.querySelector(".simulation");
    let that = this;
    simulate.addEventListener('click', that.clickSimulate.bind(that))
  }

  clickSimulate(event) {
    // console.log(card);
    this.outcomes();
    console.log(`card to add: ${this.cardToAdd}`);
  }

  update(result) {
    this.view.updateResult(result);
  }


  outcomes(){
    let deck = new Deck();
    let hand1 = [];
    let communityCards = [];
    let range = []
    
    this.holeCards.forEach(cardInfo => {
      hand1.push(deck.findCardByInfo(cardInfo));
    })

    this.boardCards.forEach(cardInfo => {
      communityCards.push(deck.findCardByInfo(cardInfo));
    })

    let rangeHand = [];
    this.range.forEach(cardInfo => {
      rangeHand.push(deck.findCardByInfo(cardInfo));
    })
    range.push(rangeHand);

    let result = this.calculator.getResult(hand1, range, communityCards, deck);
    this.update(result);
  }

  
}


export default Control;
