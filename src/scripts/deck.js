import Card from "./card.js"

const VALUES = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];
const SUITES = { diamond: "diamond", club: "club", hearts: "heart", spades: "spade" };

class Deck{
  constructor(){
    this.cards = this.makeDeck();
  }

  makeDeck(){
    let newDeck = [];
    VALUES.forEach(value => {
      Object.values(SUITES).forEach(suitSym => {
        let newCard = new Card(value, suitSym);
        newDeck.push(newCard);
      })
    })
    return newDeck;
  }

  findCardByInfo([val, suit]){
    for(let i=0; i<52; i++){
      if (this.cards[i].value === val && this.cards[i].suit === suit) {
        return this.cards[i];
      }
    }
  }

  

}



export default Deck;