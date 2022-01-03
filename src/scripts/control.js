import Calculator from "./calculator.js"
import Deck from "./deck.js"

class Control{
  constructor(view){
    this.view = view;
    this.clickPos = this.clickPos.bind(this);
    this.clickList = this.clickList.bind(this);
    this.clickButton = this.clickButton.bind(this);
    this.overButton = this.overButton.bind(this);
    // this.clickAboutNavOpen = this.clickAboutNavOpen(this);

    this.listCards = new Deck();
    this.holeCards = [];
    this.boardCards = [];
    this.rangeCards = [];
    this.posToAddCard = "";
    this.cardToAdd = [];
    this.calculator = new Calculator();
    this.taken = [];
    this.selectedButton = {};

    this.makeHighPairCombos();
    this.makeLowMidPairCombos();
    this.makeHighSuitedConnectCombos();

    this.bindPosEvents();
    this.bindSelectButtonEvents();
    this.bindSimulateEvent();
    this.bindOpponentCardRangeSwitchEvent();
    this.bindAboutModalEvent();
    this.bindCloseXEvent();
    this.bindAboutNavEvent()
  }


  // set actions on opponent's card or range
  bindOpponentCardRangeSwitchEvent(){
    let selectRange = document.querySelector(".select-range-btn")
    let selectCard = document.querySelector(".select-card-btn")
    let that = this;
    selectRange.addEventListener("click", that.clickOpenRange.bind(that))
    selectCard.addEventListener("click", that.clickOpenCard.bind(that))
  }

  clickOpenRange(){
    let rangeSelectors = document.querySelector(".opponent-range-selectors")
    let cardSelector = document.querySelector(".opponent-card-selectors")
    rangeSelectors.style.display = "block"
    cardSelector.style.display = "none"

    let rangeCards = document.querySelectorAll(".range-card")
    rangeCards.forEach(rangeCard=>{
      if (rangeCard.dataset.fill !== "empty"){
        this.removeCardFromPos(rangeCard.id);
        rangeCard.dataset.fill = "empty";
        rangeCard.src = "assets/images/cards/RED_BACK.svg"
      }
    })

    this.bindPosEvents();
    this.removeListEvents();
    let cardList = document.querySelector(".cards-sidebar")
    cardList.classList.remove("highlight")
  }

  clickOpenCard() {
    let rangeSelectors = document.querySelector(".opponent-range-selectors")
    let cardSelector = document.querySelector(".opponent-card-selectors")
    cardSelector.style.display = "block"
    rangeSelectors.style.display = "none"
    let ranges = document.querySelectorAll(".range-selector")
    ranges.forEach(range=>{
      this.selectedButton[range.id] = [];
      range.dataset.selected = "no";
      range.classList.remove("selected");
    })
    this.updateComboNumber()
  }

  // For click actions on positions
  bindPosEvents() {
    let positions = document.querySelectorAll(".hc, .fc, .tc, .rc, .range-card");
    this.positions = positions;
    positions.forEach(pos=>{
        pos.addEventListener('click', this.clickPos);
    });

  }

  removePosEvents() {
    let toBeRemovedPos = document.querySelectorAll(".hc, .fc, .tc, .rc, .range-card");
    this.toBeRemovedPos = toBeRemovedPos;
    toBeRemovedPos.forEach(pos => {
      pos.removeEventListener('click', this.clickPos);
    })
  }

  clickPos(event) {
    let pos = event.target;
    this.posToAddCard = pos.id;
    let posId = pos.id;
    if (pos.dataset.fill === "empty") {
      if ((posId.includes("flop") && parseInt(posId[4]) !== this.boardCards.length+1) ||
        (posId === "turn" && this.boardCards.length !== 3 ) || 
        (posId === "river" && this.boardCards.length !== 4)) {
        return;
      } else {
        this.bindListEvents();
        this.removePosEvents();
        this.activatePickCardPrompt();
      }
    } else {
      if ((posId.includes("flop") && parseInt(posId[4]) !== this.boardCards.length) ||
        (posId === "turn" && this.boardCards.length !== 4) ||
        (posId === "river" && this.boardCards.length !== 5)) {
        return;
      } else {
        this.removeCardFromPos(posId);
        pos.dataset.fill = "empty";
        pos.src = "assets/images/cards/RED_BACK.svg"
        return;
      }
    }
  }

  removeCardFromPos(posId){
    let cardToAddBack;
    if (posId === "hole1") {
      cardToAddBack = this.holeCards.shift();
    }
    if (posId === "hole2") {
      cardToAddBack = this.holeCards.pop();
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
    }
    if (posId === "range2") {
      cardToAddBack = this.rangeCards.pop();
    }
    let card = document.querySelector(`#${cardToAddBack[0]}${cardToAddBack[1]}`);
    
    let imgNum = `${cardToAddBack[1]}${cardToAddBack[0][0].toUpperCase()}`;
    card.src = `assets/images/cards/${imgNum}.svg`;
    
    card.dataset.taken = "no";
    this.updateComboNumber()
  }

  //for click actions on listed cards
  bindListEvents() {
    let list = document.querySelectorAll(".listed-card");
    this.list = list;
    list.forEach(pos => {
      if (pos.dataset.taken === "no"){
        pos.addEventListener('click', this.clickList)
      }
    });
  }

  removeListEvents(){
    let toBeRemovedCard = document.querySelectorAll(".listed-card");
    this.toBeRemovedCard = toBeRemovedCard;
    toBeRemovedCard.forEach(pos => {
      pos.removeEventListener('click', this.clickList);
    })
  }

  clickList(event) {
    let card = event.target;
    this.bindPosEvents();
    this.removeListEvents();
    this.addCardtoPos(card);
    card.dataset.taken = "yes";
    card.src = "assets/images/cards/RED_BACK.svg";
    this.activatePickPosPrompt();
    
  }

  addCardtoPos(card){
    let cardSuit = card.dataset.suit
    let cardVal = card.dataset.value
        
    let cardInfo = [cardSuit, cardVal];
    this.taken.push(cardInfo);

    let posId = this.posToAddCard
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

    let imgNum = `${cardVal}${cardSuit[0].toUpperCase()}`;
    pos.src = `assets/images/cards/${imgNum}.svg`;

    pos.dataset.fill = "filled";
    this.updateComboNumber()
  }
  
  // add click actions for range selector buttons
  bindSelectButtonEvents() {
    let buttons = document.querySelectorAll(".range-selector");
    buttons.forEach(button => {
        button.addEventListener('click', this.clickButton);
        // button.addEventListener('mouseover', this.overButton);
    });
  }

  clickButton(event){
    event.preventDefault();
    let button = event.target;
    let buttonId = button.id
    
    if (button.dataset.selected === "no"){
      let combos = this.makeCombos(buttonId);
      button.classList.add("selected");
      this.selectedButton[buttonId] = combos;
      button.dataset.selected ="yes";
    } else {
      this.selectedButton[buttonId] = [];
      button.dataset.selected = "no";
      button.classList.remove("selected");
    }
    this.updateComboNumber();
  }

  overButton(event) {
    let button = event.target;
    let buttonId = button.id;

    let prompt = document.querySelector(".prompt-details")
    
    if (buttonId === "high-pairs") {
      prompt.innerHTML = "<p>High pairs are AA, KK, QQ, JJ, 10s</p>";
    } else if (buttonId === "low-mid-pairs") {
      prompt.innerHTML = "<p>These include pair 99, 88, 77, 66, 55, 44, 33, 22</p>";
    } else if (buttonId === "high-suited-connect"){
      prompt.innerHTML = "<p>These are suited AK, KQ, QJ, J10s</p>";
    }
  }

  updateComboNumber(){
    let ele = document.querySelector('.opponent-range-info');
    let sum = 0;
    let limit = [];
    if (this.rangeCards.length === 2) sum = 1
    if (this.boardCards.length > 0){
      this.boardCards.forEach(cardInfo => limit.push(cardInfo.join("")));
    }
    if(this.holeCards.length > 0) {
      this.holeCards.forEach(cardInfo => limit.push(cardInfo.join("")));
    }
    Object.values(this.selectedButton).forEach(arr => {
      sum += arr.length;
      let subtract = 0;
      arr.forEach(combo => {
        if (limit.includes(combo[0].join("")) || limit.includes(combo[1].join(""))) {
          subtract += 1;
        }
      })
      sum -= subtract;
    })
    let newInfo = `${sum} hands selected`
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
        for (let j = i+1; j < 4; j++) {
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
        for (let j = i+1; j < 4; j++) {
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
        for (let j = i+1; j < vals.length; j++) {
          result.push([[suits[s], vals[i]], [suits[s], vals[j]]]);
        }
      }
    }
    this.highSuitedConnectCombos = result;
    return;
  }

  // add click action to simulation button
  bindSimulateEvent() {
    let simulate = document.getElementById("simulation");
    let that = this;
    simulate.addEventListener('click', that.clickSimulate.bind(that))
  }

  clickSimulate(event) {
    // let spinner = document.querySelector(".spinner-hidden");
    // spinner.className = "spinner";

    let target = event.target;
    // target.innerHTML = "Loading"
    this.outcomes(target);
  }

  outcomes(target){

    setTimeout(()=>{

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
      
      let limit = [];
      if (this.boardCards.length > 0) {
        this.boardCards.forEach(cardInfo => limit.push(cardInfo.join("")));
      }
      if (this.holeCards.length > 0) {
        this.holeCards.forEach(cardInfo => limit.push(cardInfo.join("")));
      }

      rangeCombos.forEach(combo => {
        let rangeHand = [];
        if ((!limit.includes(combo[0].join(""))) && (!limit.includes(combo[1].join("")))){

          combo.forEach(cardInfo =>{
            rangeHand.push(deck.findCardByInfo(cardInfo));
          })
        }
        if (rangeHand.length > 1) finalRange.push(rangeHand);
      })

      if (hand1.length < 2) {
        this.view.noResult()
      } else {
        let result = this.calculator.getResult(hand1, finalRange, communityCards, deck);
        if(result[3] === 0) {
          this.view.noResult();
        } else {
          this.view.updateResult(result);
        }
      }

      target.innerHTML = "Ask Him";

    }, 1);
    target.innerHTML = "Loading";
  }

  // prompts activators
  activatePickCardPrompt() {
    let prompt1 = document.querySelector(".prompt-details")
    prompt1.innerHTML = "<p>Pick a card from the available cards!</p>";

    let cardList = document.querySelector(".cards-sidebar")
    cardList.classList.add("highlight")
  }

  activatePickPosPrompt() {
    let prompt1 = document.querySelector(".prompt-details")
    prompt1.innerHTML = "<p>Add board cards or Ask Him!</p>";

    let cardList = document.querySelector(".cards-sidebar")
    cardList.classList.remove("highlight")
  }

  // about events
  bindAboutModalEvent() {
    let about = document.querySelector(".about")
    let that = this;
    about.addEventListener('click', that.clickAboutModalOpen.bind(that))
  }

  clickAboutModalOpen() {
    let aboutModal = document.querySelector(".modal-child")
    let aboutBackground = document.querySelector(".modal-background")
    let aboutDetails1 = document.querySelector("#about-details-1")

    // debugger
    // if (!aboutModal.classList.contains("about-active")) {
    //   aboutModal.classList.add("about-active")
    // }
    if (!aboutModal.style.display || aboutModal.style.display === "none") {
      aboutModal.style.display = "block";
      aboutBackground.style.display = "block"
      aboutDetails1.classList.add("about-details-active")
    }
  }

  bindAboutNavEvent() {
    let aboutNavs = document.querySelectorAll(".about-btn")
    let that = this;
    aboutNavs.forEach(aboutNav=>{
      aboutNav.addEventListener('click', that.clickAboutNavOpen.bind(that))
    })
  }

  clickAboutNavOpen(event) {
    let aboutBtnTarget = event.currentTarget;
    // console.log(aboutBtnTarget.id)
    let aboutBtnActive = document.querySelector(".about-btn-active")
    let num = aboutBtnTarget.id.slice(-1)
    let aboutDetails = document.querySelector(`#about-details-${num}`)
    let aboutDetailsActive = document.querySelector(".about-details-active")

    if (aboutBtnTarget.id !== aboutBtnActive.id) {
      aboutBtnTarget.classList.add("about-btn-active");
      aboutBtnActive.classList.remove("about-btn-active");
      aboutDetails.classList.add("about-details-active");
      aboutDetailsActive.classList.remove("about-details-active")
    }

  }

  bindCloseXEvent() {
    let closeX = document.querySelector(".close-x")
    let that = this;
    closeX.addEventListener("click", that.clickAboutClose.bind(that))
  }

  clickAboutClose(event) {
    event.stopPropagation()
    let aboutModal = document.querySelector(".modal-child")
    let aboutBackground = document.querySelector(".modal-background")
    aboutModal.style.display = "none";
    aboutBackground.style.display = "none"

    let aboutBtnActive = document.querySelector(".about-btn-active")
    let aboutBtn1 = document.querySelector("#about-btn-1")
    let aboutDetails1 = document.querySelector("#about-details-1")
    let aboutDetailsActive = document.querySelector(".about-details-active")

    aboutBtn1.classList.add("about-btn-active");
    aboutBtnActive.classList.remove("about-btn-active");

    aboutDetails1.classList.add("about-details-active")
    aboutDetailsActive.classList.remove("about-details-active")
  }
}


export default Control;
