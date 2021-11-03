class View {
  constructor(){
    // this.clickCard = this.clickCard.bind(this);
    // this.bindPosEvents();
  }

  setupHoleCards(el){
    const holeCards = document.createElement("ul");
    let hc1 = document.createElement("img");
    hc1.dataset.pos = "hole1";
    hc1.dataset.fill = "empty";
    hc1.className = "hc";
    hc1.id = "hole1";
    hc1.src = "assets/images/cards/BLUE_BACK.svg";

    let hc2 = document.createElement("img");
    hc2.dataset.pos = "hole2";
    hc2.dataset.fill = "empty";
    hc2.className = "hc";
    hc2.id = "hole2";
    hc2.src = "assets/images/cards/BLUE_BACK.svg";

    holeCards.appendChild(hc1);
    holeCards.appendChild(hc2);
    el.append(holeCards);
    // let hc1 = document.createElement("li");
    // hc1.dataset.pos = "hole1";
    // hc1.dataset.fill = "empty";
    // hc1.className = "hc";
    // hc1.id = "hole1";
    // let hc2 = document.createElement("li");
    // hc2.dataset.pos = "hole2";
    // hc2.dataset.fill = "empty";
    // hc2.className = "hc";
    // hc2.id = "hole2";
    // holeCards.appendChild(hc1);
    // holeCards.appendChild(hc2);
    // el.append(holeCards);
    // 
  }

  setupBoardCards(el){
    const boardCards = document.createElement("ul");

    for(let i=0; i<3; i++){
      let flopCard = document.createElement("img");
      let position = `flop${i+1}`;
      flopCard.dataset.pos = position;
      flopCard.dataset.fill = "empty";
      flopCard.className = "fc";
      flopCard.id = position;
      flopCard.src = "assets/images/cards/BLUE_BACK.svg";
      boardCards.appendChild(flopCard);
    }

    let turnCard = document.createElement("img");
    turnCard.dataset.pos = "turn";
    turnCard.dataset.fill = "empty";
    turnCard.className = "tc";
    turnCard.id = "turn";
    turnCard.src = "assets/images/cards/BLUE_BACK.svg";


    let riverCard = document.createElement("img");
    riverCard.dataset.pos = "river";
    riverCard.dataset.fill = "empty";
    riverCard.className = "rc";
    riverCard.id = "river";
    riverCard.src = "assets/images/cards/BLUE_BACK.svg";


    boardCards.appendChild(turnCard);
    boardCards.appendChild(riverCard);

    el.appendChild(boardCards);
  }

  setupSideCards(el){
    const values = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];
    const suits = ["diamond", "club", "heart", "spade" ];
    const sideCards = document.createElement("ul");

    for (let i = 0; i < 13; i++){
      for (let j=0; j < 4; j++){
        let card = document.createElement("img");
        card.dataset.value = values[i];
        card.dataset.suit = suits[j];
        card.dataset.taken = "no";
        card.id = `${suits[j]}${values[i]}`;
        card.className = "listed-card";
        let imgNum = `${values[i]}${suits[j][0].toUpperCase()}`;
        card.src = `assets/images/cards/${imgNum}.svg`;

        

        // let cardImg = document.createElement("img");
        // let imgNum = `${values[i]}${suits[j][0].toUpperCase()}`;
        // cardImg.className = "card-image"
        // cardImg.src = `assets/images/cards/${imgNum}.svg`;

        // card.appendChild(cardImg);
        sideCards.appendChild(card);
      }
    }
    el.appendChild(sideCards);
  }

  // to be refactored
  setupRangeCards(el){
    const rangeCards = document.createElement("ul");
    let range1 = document.createElement("img");
    range1.className = "range-card";
    range1.dataset.pos = "range1";
    range1.dataset.fill = "empty";
    range1.id = "range1";
    range1.src = "assets/images/cards/BLUE_BACK.svg";

    let range2 = document.createElement("img");
    range2.className = "range-card"
    range2.dataset.pos = "range2";
    range2.dataset.fill = "empty";
    range2.id = "range2";
    range2.src = "assets/images/cards/BLUE_BACK.svg";

    rangeCards.appendChild(range1);
    rangeCards.appendChild(range2);
    el.append(rangeCards);
  }

  setupRangeSelector(el){
    // const rangeOptions = document.createElement("ul");

    let highPairs = document.createElement("BUTTON");
      highPairs.id = "high-pairs";
      highPairs.innerHTML = "AsKs"
    
    let lowMidPairs = document.createElement("button");
      lowMidPairs.id = "low-mid-pairs";
      lowMidPairs.innerHTML = "Pocket Pairs";

    let highSuitedConnects = document.createElement("button")
      highSuitedConnects.id = "high-suited-connect";
      highSuitedConnects.innerHTML = "High Suited Connectors";

    [highPairs, lowMidPairs, highSuitedConnects].forEach(button => {
      button.className = "range-selector";
      button.dataset.selected = "no";
      el.appendChild(button);
    })

    // el.appendChild(rangeOptions);
  }



  updateResult(result){
    const resultDisplay = document.querySelector(".result-display")
    resultDisplay.innerHTML = `<li>Win: ${(result[0]*100).toFixed(1)}%</li>
    <li>Lose: ${(result[1]*100).toFixed(1) }%</li>
    <li>Tie: ${(result[2]*100).toFixed(1)}%</li>`
    // <li>Total Number of Simulations: ${result[3]}</li>
  }
  
}

export default View;
