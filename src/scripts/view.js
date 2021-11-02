class View {
  constructor(){
    // this.clickCard = this.clickCard.bind(this);
    // this.bindPosEvents();
  }

  setupHoleCards(el){
    const holeCards = document.createElement("ul");
    let hc1 = document.createElement("li");
    hc1.dataset.pos = "hcPos1";
    hc1.className = "hc";
    let hc2 = document.createElement("li");
    hc2.dataset.pos = "hcPos2";
    hc2.className = "hc";
    holeCards.appendChild(hc1);
    holeCards.appendChild(hc2);
    el.append(holeCards);
  }

  setupBoardCards(el){
    const boardCards = document.createElement("ul");

    for(let i=0; i<3; i++){
      let flopCard = document.createElement("li");
      let position = `flopPos${i}`;
      flopCard.dataset.pos = position;
      flopCard.className = "fc";
      boardCards.appendChild(flopCard);
    }

    let turnCard = document.createElement("li");
    turnCard.dataset.pos = "tcPos";
    turnCard.className = "tc";
    let riverCard = document.createElement("li");
    riverCard.dataset.pos = "rcPos";
    riverCard.className = "rc";
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
        let card = document.createElement("li");
        card.dataset.value = values[i];
        card.dataset.suit = suits[j];
        card.className = "listed-card";
        sideCards.appendChild(card);
      }
    }
    el.appendChild(sideCards);
  }

  // to be refactored
  setupRange(el){
    const rangeCards = document.createElement("ul");
    let rc1 = document.createElement("li");
    rc1.dataset.pos = "range1";
    rc1.className = "range-card";
    let rc2 = document.createElement("li");
    rc2.dataset.pos = "range2";
    rc2.className = "range-card"
    rangeCards.appendChild(rc1);
    rangeCards.appendChild(rc2);
    el.append(rangeCards);
  }

  updateResult(result){
    const resultDisplay = document.querySelector(".result-display")
    resultDisplay.innerHTML = `<li>win%:${(result[0]*100).toFixed(1)}%</li>
    <li>lose%:${(result[1]*100).toFixed(1) }%</li>
    <li>tie%:${(result[2]*100).toFixed(1)}%</li>`
  }
}

export default View;
