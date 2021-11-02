class View {
  constructor(){
    // this.clickCard = this.clickCard.bind(this);
    // this.bindPosEvents();
  }

  setupHoleCards(el){
    const holeCards = document.createElement("ul");
    let hc1 = document.createElement("li");
    hc1.dataset.pos = "hole1";
    hc1.dataset.fill = "empty";
    hc1.className = "hc";
    hc1.id = "hole1";
    let hc2 = document.createElement("li");
    hc2.dataset.pos = "hole2";
    hc2.dataset.fill = "empty";
    hc2.className = "hc";
    hc2.id = "hole2";
    holeCards.appendChild(hc1);
    holeCards.appendChild(hc2);
    el.append(holeCards);
  }

  setupBoardCards(el){
    const boardCards = document.createElement("ul");

    for(let i=0; i<3; i++){
      let flopCard = document.createElement("li");
      let position = `flop${i+1}`;
      flopCard.dataset.pos = position;
      flopCard.dataset.fill = "empty";
      flopCard.className = "fc";
      flopCard.id = position;
      boardCards.appendChild(flopCard);
    }

    let turnCard = document.createElement("li");
    turnCard.dataset.pos = "turn";
    turnCard.dataset.fill = "empty";
    turnCard.className = "tc";
    turnCard.id = "turn";

    let riverCard = document.createElement("li");
    riverCard.dataset.pos = "river";
    riverCard.dataset.fill = "empty";
    riverCard.className = "rc";
    riverCard.id = "river"

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
        card.dataset.taken = "no";
        card.id = `${suits[j]}${values[i]}`;
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
    rc1.className = "range-card";
    rc1.dataset.pos = "range1";
    rc1.dataset.fill = "empty";
    rc1.id = "range1";
    let rc2 = document.createElement("li");
    rc2.className = "range-card"
    rc2.dataset.pos = "range2";
    rc2.dataset.fill = "empty";
    rc2.id = "range2";
    rangeCards.appendChild(rc1);
    rangeCards.appendChild(rc2);
    el.append(rangeCards);
  }

  updateResult(result){
    const resultDisplay = document.querySelector(".result-display")
    resultDisplay.innerHTML = `<li>Win: ${(result[0]*100).toFixed(1)}%</li>
    <li>Lose: ${(result[1]*100).toFixed(1) }%</li>
    <li>Tie: ${(result[2]*100).toFixed(1)}%</li>`
  }
}

export default View;
