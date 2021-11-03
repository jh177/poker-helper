import Calculator from "./calculator.js"
import Deck from "./deck.js"

class Control{
  constructor(view){
    this.view = view;
    this.clickPos = this.clickPos.bind(this);
    this.clickList = this.clickList.bind(this);
    this.clickButton = this.clickButton.bind(this);

    this.listCards = new Deck();
    this.holeCards = [];
    this.boardCards = [];
    this.rangeCards = [];
    this.posToAddCard = "";
    this.cardToAdd = [];
    this.calculator = new Calculator();
    this.taken = [];
    this.selectedButton = {};
    // this.rangeCombos = [];

    this.makeHighPairCombos();
    this.makeLowMidPairCombos();
    this.makeHighSuitedConnectCombos();

    this.bindPosEvents();
    this.bindSelectButtonEvents();
    this.bindSimulateEvent();
  }


  // For click actions on positions
  bindPosEvents() {
    let positions = document.querySelectorAll(".hc, .fc, .tc, .rc, .range-card");
    this.positions = positions;
    // positions.forEach(pos=> pos.className += "haha");
    positions.forEach(pos=>{
      // let that = this;
      // pos.dataset.clickCount = "0";
      // if (pos.dataset.fill === "empty"){
        pos.addEventListener('click', this.clickPos);
      // } else {
      //   pos.addEventListener('click', this.removeCardFromPos);
      // }
    });
    console.log("add position listeners!")
      // pos.addEventListener('click', that.clickPos.bind(that))});
  }

  removePosEvents() {
    let toBeRemovedPos = document.querySelectorAll(".hc, .fc, .tc, .rc, .range-card");
    this.toBeRemovedPos = toBeRemovedPos;
    toBeRemovedPos.forEach(pos => {
      pos.removeEventListener('click', this.clickPos);
    })
    console.log("removed position listenser!")
  }

  clickPos(event) {
    let pos = event.target;
    this.posToAddCard = pos.id;
    if (pos.dataset.fill === "empty") {
      this.bindListEvents(); 
      this.removePosEvents();
    } else {
      let posId = pos.id;
      this.removeCardFromPos(posId);
      pos.dataset.fill = "empty";
      return;
    }
    
    console.log(`hole cards: ${this.holeCards}`);
    console.log(`board cards: ${this.boardCards}`)
    console.log(`range cards: ${this.rangeCards}`)
    
  }

  removeCardFromPos(posId){
    let cardToAddBack;
    console.log(this.holeCards)
    if (posId === "hole1") {
      cardToAddBack = this.holeCards.shift();
      // this.holeCards = this.holeCards.slice(1);
    }
    if (posId === "hole2") {
      cardToAddBack = this.holeCards.pop();
      // this.holeCards = this.holeCards.slice(0,1);
    }
    for (let i=1; i<=3; i++){
      if (posId === `flop${i}`) {
        cardToAddBack = this.boardCards[i-1];
        this.boardCards = this.boardCards.slice(0,i-1).concat(this.boardCards.slice(i,5));
      }
    }
    if (posId === "turn") {
      cardToAddBack = this.boardCards[3];
      this.boardCards = this.boardCards.slice(0, 3).concat(this.boardCards.slice(4, 5));
    }
    if (posId === "river") {
      cardToAddBack = this.boardCards[4];
      this.boardCards = this.boardCards.slice(0, 4);
    }
    if (posId === "range1") {
      cardToAddBack = this.rangeCards.shift();
      // this.holeCards = this.holeCards.slice(1);
    }
    if (posId === "range2") {
      cardToAddBack = this.rangeCards.pop();
      // this.holeCards = this.holeCards.slice(0,1);
    }
    // pos.data.fill = "empty"
    console.log(cardToAddBack)
    let card = document.querySelector(`#${cardToAddBack[0]}${cardToAddBack[1]}`);
    card.dataset.taken = "no";
  }

  // add card to pos, remove from card list
  // addCard(pos) {
  //   let cardPos = pos.dataset.pos
  //   let check = cardPos.substring(0,3);

  //   if (this.cardToAdd.length !== 0){
  //     let card = this.cardToAdd.pop();
  //     if (check === "hcP"){
  //       this.holeCards.push(card);
  //     } else if (check === "flo"){
  //       this.boardCards.push(card)
  //     } else if (check === "tcP"){
  //       this.boardCards.push(card);
  //     } else if (check === "rcP"){
  //       this.boardCards.push(card)
  //     } else if (check === "ran"){
  //       this.range.push(card);
  //     }
  //   }
  // }


  //for click actions on listed cards
  bindListEvents() {
    let list = document.querySelectorAll(".listed-card");
    this.list = list;
    list.forEach(pos => {
      // let that = this;
      // pos.dataset.clickCount = "0";
      if (pos.dataset.taken === "no"){
        pos.addEventListener('click', this.clickList)
        // pos.removeEventListener('click', that.clickList.bind(that));
      }
    });
    console.log("add list cards listeners!")
    console.log(`taken cards ${this.taken}`)
  }

  removeListEvents(){
    let toBeRemovedCard = document.querySelectorAll(".listed-card");
    this.toBeRemovedCard = toBeRemovedCard;
    toBeRemovedCard.forEach(pos => {
      pos.removeEventListener('click', this.clickList);
    })
    console.log("removed list cards listeners!")
  }

  clickList(event) {
    let card = event.target;
    // console.log(card);
    // this.addListedCard(card);
    this.bindPosEvents();
    this.removeListEvents();
    this.addCardtoPos(card);
    card.dataset.taken = "yes";
    // console.log(`card to add: ${this.cardToAdd}`);
    // let that = this;
    // card.removeEventListener("click", this.clickList)
  }

  // addListedCard(card){
  //   let cardVal = card.dataset.value
  //   let cardSuit = card.dataset.suit
  //   console.log(cardVal, cardSuit);
  //   this.cardToAdd.push([cardVal, cardSuit]);
  //   this.taken.push([cardVal, cardSuit]);
  // }

  addCardtoPos(card){
    let cardSuit = card.dataset.suit
    let cardVal = card.dataset.value
    
    console.log(cardVal, cardSuit);
    
    let cardInfo = [cardSuit, cardVal];
    this.taken.push(cardInfo);

    let posId = this.posToAddCard
    // console.log(posId)
    if (posId === "hole1") {
      this.holeCards.unshift(cardInfo);
    } else if (posId === "hole2") {
      this.holeCards.push(cardInfo);
    } else if (posId === "flop1") {
      this.boardCards.unshift(cardInfo);
    } else if (posId === "flop2") {
      this.boardCards = this.boardCards.slice(0,1).concat([cardInfo], this.boardCards.slice(1))
    } else if (posId === "flop3") {
      this.boardCards = this.boardCards.slice(0, 2).concat([cardInfo], this.boardCards.slice(2))
    } else if (posId === "turn") {
      this.boardCards = this.boardCards.slice(0, 3).concat([cardInfo], this.boardCards.slice(3))
    } else if (posId === "river") {
      this.boardCards.push(cardInfo);
    } else if (posId==="range1") {
      this.rangeCards.unshift(cardInfo);
    } else if (posId === "range2") {
      this.rangeCards.push(cardInfo);
    }

    let pos = document.querySelector(`#${this.posToAddCard}`);
    pos.dataset.fill = "filled"
  }
  

  // add click actions for range selector buttons
  bindSelectButtonEvents() {
    let buttons = document.querySelectorAll(".range-selector");
    buttons.forEach(button => {
        button.addEventListener('click', this.clickButton)
    });
  }

  clickButton(event){
    event.preventDefault();
    let button = event.target;
    let buttonId = button.id
    
    if (button.dataset.selected === "no"){
      console.log("click to yes!")
      let combos = this.makeCombos(buttonId);
      this.selectedButton[buttonId] = combos;
      button.dataset.selected ="yes";
    } else {
      console.log("click to no!")
      this.selectedButton[buttonId] = [];
      button.dataset.selected = "no";
    }
    this.updateComboNumber();
  }

  updateComboNumber(){
    let ele = document.querySelector('.selected-range');
    let sum = 0;
    Object.values(this.selectedButton).forEach(arr => {
      sum += arr.length;
    })
    let newInfo = `Selected Combos: ${sum}`;
    ele.innerHTML = newInfo;
  }

  makeCombos(buttonId){
    let combos = [];
    if (buttonId === "high-pairs"){ combos = this.highPairCombos;}
    if (buttonId === "low-mid-pairs"){ combos = this.lowMidPairCombos;}
    if (buttonId === "high-suited-connect"){combos = this.highSuitedConnectCombos;}
    return combos;
  }

  makeHighPairCombos(){
    let vals = ["10", "J", "Q", "K", "A"];
    let suits = ["diamond", "club", "heart", "spade"];
    let result = [];
    for (let v = 0; v < vals.length; v++) {
      for (let i = 0; i < 3; i++) {
        for (let j = 1; j < 4; j++) {
          result.push([[suits[i], vals[v]], [suits[j], vals[v]]]);
        }
      }
    }
    this.highPairCombos = result;
    return;
  }

  makeLowMidPairCombos(){
    let vals = ["2", "3", "4", "5", "6", "7", "8", "9"];
    let suits = ["diamond", "club", "heart", "spade"];
    let result = [];
    for (let v = 0; v < vals.length; v++) {
      for (let i = 0; i < 3; i++) {
        for (let j = 1; j < 4; j++) {
          result.push([[suits[i], vals[v]], [suits[j], vals[v]]]);
        }
      }
    }
    this.lowMidPairCombos = result;
    return;
  }

  makeHighSuitedConnectCombos() {
    let vals = ["10", "J", "Q", "K", "A"];
    let suits = ["diamond", "club", "heart", "spade"];
    let result = [];
    for (let s = 0; s < 4; s++) {
      for (let i = 0; i < vals.length; i++) {
        for (let j = 1; j < vals.length; j++) {
          result.push([[suits[s], vals[i]], [suits[s], vals[j]]]);
        }
      }
    }
    this.highSuitedConnectCombos = result;
    return;
  }





  // add click action to simulation button
  bindSimulateEvent() {
    let simulate = document.querySelector(".simulation");
    let that = this;
    simulate.addEventListener('click', that.clickSimulate.bind(that))
  }

  clickSimulate(event) {
    // console.log(card);
    this.outcomes();
  }

  update(result) {
    this.view.updateResult(result);
  }


  outcomes(){
    let deck = new Deck();
    let hand1 = [];
    let communityCards = [];
    let finalRange = []
    

    this.holeCards.forEach(cardInfo => {
      hand1.push(deck.findCardByInfo(cardInfo));
    })

    this.boardCards.forEach(cardInfo => {
      communityCards.push(deck.findCardByInfo(cardInfo));
    })

    let rangeCombos = [];
    Object.values(this.selectedButton).forEach(combos => {
      rangeCombos = rangeCombos.concat(combos);
    })
    if (this.rangeCards.length >1) rangeCombos.push(this.rangeCards);

    rangeCombos.forEach(combo => {
      let rangeHand = [];
      combo.forEach(cardInfo =>{
        rangeHand.push(deck.findCardByInfo(cardInfo));
      })
      finalRange.push(rangeHand);
    })

    console.log(finalRange)

    let result = this.calculator.getResult(hand1, finalRange, communityCards, deck);
    this.update(result);
  }
}


export default Control;
