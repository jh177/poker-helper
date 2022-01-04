class View {
  constructor(){
    this.setupHoleCards();
    this.setupBoardCards();
    this.setupSideCards();
    this.setupRangeCards();
    this.setupRangeSelector();
  }

  setupHoleCards(){
    const holeCardsEl = document.querySelector(".hole-cards");
    const holeCards = document.createElement("ul");
    let hc1 = document.createElement("img");
    hc1.dataset.pos = "hole1";
    hc1.dataset.fill = "empty";
    hc1.className = "hc";
    hc1.id = "hole1";
    hc1.src = "assets/images/cards/RED_BACK.svg";

    let hc2 = document.createElement("img");
    hc2.dataset.pos = "hole2";
    hc2.dataset.fill = "empty";
    hc2.className = "hc";
    hc2.id = "hole2";
    hc2.src = "assets/images/cards/RED_BACK.svg";

    holeCards.appendChild(hc1);
    holeCards.appendChild(hc2);
    holeCardsEl.append(holeCards); 
  }

  setupBoardCards(){
    const boardCardsEl = document.querySelector(".board-cards");
    const boardCards = document.createElement("ul");

    for(let i=0; i<3; i++){
      let flopCard = document.createElement("img");
      let position = `flop${i+1}`;
      flopCard.dataset.pos = position;
      flopCard.dataset.fill = "empty";
      flopCard.className = "fc";
      flopCard.id = position;
      flopCard.src = "assets/images/cards/RED_BACK.svg";
      boardCards.appendChild(flopCard);
    }

    let turnCard = document.createElement("img");
    turnCard.dataset.pos = "turn";
    turnCard.dataset.fill = "empty";
    turnCard.className = "tc";
    turnCard.id = "turn";
    turnCard.src = "assets/images/cards/RED_BACK.svg";


    let riverCard = document.createElement("img");
    riverCard.dataset.pos = "river";
    riverCard.dataset.fill = "empty";
    riverCard.className = "rc";
    riverCard.id = "river";
    riverCard.src = "assets/images/cards/RED_BACK.svg";


    boardCards.appendChild(turnCard);
    boardCards.appendChild(riverCard);

    boardCardsEl.appendChild(boardCards);
  }

  setupSideCards(){
    const sideCardsEl = document.querySelector(".side-cards");
    const values = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];
    // const suits = ["diamond", "club", "heart", "spade" ];
    
    const diamond = document.createElement("ul");
    diamond.className = "diamond";
    const club = document.createElement("ul");
    club.className = "club";
    const heart = document.createElement("ul");
    heart.className = "heart";
    const spade = document.createElement("ul");
    spade.className = "spade;"

    this.makeSideCards(values, diamond, "diamond");
    this.makeSideCards(values, club, "club");
    this.makeSideCards(values, heart, "heart");
    this.makeSideCards(values, spade, "spade");

    sideCardsEl.appendChild(diamond);
    sideCardsEl.appendChild(club);
    sideCardsEl.appendChild(heart);
    sideCardsEl.appendChild(spade);

  }

  makeSideCards(values, group, suit){
    for (let i = 0; i < 13; i++){
      let card = document.createElement("img");
      card.dataset.value = values[i];
      card.dataset.suit = suit;
      card.dataset.taken = "no";
      card.id = `${suit}${values[i]}`;
      card.className = "listed-card";
      let imgNum = `${values[i]}${suit[0].toUpperCase()}`;
      card.src = `assets/images/cards/${imgNum}.svg`;
      group.appendChild(card);
    }
  }

  // to be refactored
  setupRangeCards(){
    const rangeEl = document.querySelector(".opponent-card-selectors");
    const rangeCards = document.createElement("ul");
    let range1 = document.createElement("img");
    range1.className = "range-card";
    range1.dataset.pos = "range1";
    range1.dataset.fill = "empty";
    range1.id = "range1";
    range1.src = "assets/images/cards/RED_BACK.svg";

    let range2 = document.createElement("img");
    range2.className = "range-card"
    range2.dataset.pos = "range2";
    range2.dataset.fill = "empty";
    range2.id = "range2";
    range2.src = "assets/images/cards/RED_BACK.svg";

    rangeCards.appendChild(range1);
    rangeCards.appendChild(range2);
    rangeEl.append(rangeCards);
  }

  setupRangeSelector(){
    const rangeEl1 = document.querySelector(".opponent-range-selectors");
    const rangeOptions = document.createElement("ul");
    rangeOptions.className = "range-options"

    let highPairs = document.createElement("li");
      highPairs.id = "high-pairs";
      highPairs.innerHTML = "High Pairs"

    let highPairsPrompt = document.createElement("div")
    highPairsPrompt.className = "range-selector-prompt";
    highPairsPrompt.innerHTML = "<p>High pairs are AA, KK, QQ, JJ, 10s</p>"
    highPairs.appendChild(highPairsPrompt);
    
    let lowMidPairs = document.createElement("li");
      lowMidPairs.id = "low-mid-pairs";
      lowMidPairs.innerHTML = "Mid-small Pairs";

    let lowMidPairsPrompt = document.createElement("div")
    lowMidPairsPrompt.className = "range-selector-prompt";
    lowMidPairsPrompt.innerHTML = "<p>Mid-small pairs include pair 99, 88, 77, 66, 55, 44, 33, 22</p>"
    lowMidPairs.appendChild(lowMidPairsPrompt);

    let highSuitedConnects = document.createElement("li")
      highSuitedConnects.id = "high-suited-connect";
      highSuitedConnects.innerHTML = "High Suited Connectors";

    let highSuitedConnectsPrompt = document.createElement("div")
    highSuitedConnectsPrompt.className = "range-selector-prompt";
    highSuitedConnectsPrompt.innerHTML = "<p>High suited connectors include suited AK, KQ, QJ, J10s</p>"
    highSuitedConnects.appendChild(highSuitedConnectsPrompt);

    [highPairs, lowMidPairs, highSuitedConnects].forEach(li => {
      li.className = "range-selector";
      li.dataset.selected = "no";
      rangeOptions.appendChild(li);
    })

    rangeEl1.appendChild(rangeOptions);
  }

  updateResult(result){
    const resultDisplay = document.querySelector(".result-display-lists")
    resultDisplay.innerHTML = `<li>Win: ${(result[0]*100).toFixed(1)}%</li>
    <li>Lose: ${(result[1]*100).toFixed(1) }%</li>
    <li>Split: ${(result[2]*100).toFixed(1)}%</li>`
    // <li>Total Number of Simulations: ${result[3]}</li>
  }
  
  noResult(){
    let prompt = document.querySelector(".prompt-details")
    prompt.innerHTML = "<p>Please at least select your cards and opponent's cards or range to start</p>";

    const resultDisplay = document.querySelector(".result-display-lists")
    resultDisplay.innerHTML = 'Oops, not enough Info!';
  }

  incorrectCommunityCards(){
    let prompt = document.querySelector(".prompt-details")
    prompt.innerHTML = "<p>Please make sure to have 0 or 3 or 4 or 5 community cards</p>";

    const resultDisplay = document.querySelector(".result-display-lists")
    resultDisplay.innerHTML = 'Oops, not enough Info!';
  }

}

export default View;
