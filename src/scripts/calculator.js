import Card from "./card.js"
import Deck from "./deck.js"

const VALUES = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];
// const SUITES = { diamond: "♦", club: "♣", hearts: "♥", spades: "♠" };

// const RANK = {
//   RoyalFlush:1, 
//   StraightFlush:2,
//   FourOfAKind:3,
//   FullHouse: 4,
//   Flush: 5,
//   Straight: 6,
//   ThreeOfAKind: 7,
//   TwoPairs: 8,
//   OnePair: 9,
//   HighCard: 10
// }

class Calculator {
  constructor(){
    // this.holeCards = round.holeCards;
    // this.communityCards = round.communityCards;
    // this.opponentRange = round.opponentRange;
  }

  
  // function to get all the five card combos out of two hole cards plus 5 board cards
  fiveCardCombos(hand, boardCards){
    let cards = hand.concat(boardCards);
    let combos = this.comboMaker(cards, 5);
    return combos;
  }

  // main function to get hand strength of any five cards
  handStrength(fiveCards){
    let handValues = this.sortHandValues(fiveCards.map(card => card.value));
    let handSuits = fiveCards.map(card => card.suit);
    this.sortHandValues(handSuits);

    //check royal flush
    if (handValues.join("") === "10JQKA" && this.checkFlush(handSuits)) {
      return [1, "RoyalFlush"];
    }

    //check straight flush
    if (this.checkStraight(handValues) && this.checkFlush(handSuits)){
      return [2, "StraightFlush", VALUES.indexOf(handValues[4])];
    }
    
    //flush
    if (this.checkFlush(handSuits)){
      return [5,
        "Flush",
        VALUES.indexOf(handValues[0]),
        VALUES.indexOf(handValues[1]),
        VALUES.indexOf(handValues[2]),
        VALUES.indexOf(handValues[3]),
        VALUES.indexOf(handValues[4]),
      ];
    }

    //check straight
    if (this.checkStraight(handValues)){
      return [6, 
        "Straight",
        VALUES.indexOf(handValues[4])
      ]
    } ;

    // count card values
    let cardValCount = {};
    handValues.forEach(val => {
      if (cardValCount[val] === undefined) {
        cardValCount[val] = 1;
      } else {
        cardValCount[val] += 1;
      }
    })

    //check 4 of a kind
    if (this.checkFourOfKind(cardValCount)) {
      return [3, 
        "FourOfAKind",
        VALUES.indexOf(this.getCardValByCount(cardValCount, 4)),
        VALUES.indexOf(this.getCardValByCount(cardValCount, 1))];
    }

    //full house
    if (this.checkFullHouse(cardValCount)) {
      return [4, 
        "FullHouse", 
        VALUES.indexOf(this.getCardValByCount(cardValCount, 3)), 
        VALUES.indexOf(this.getCardValByCount(cardValCount, 2))];
    }

    //three of a kind
    if (this.checkThreeOfKind(cardValCount)){
      return [7, 
        "ThreeOfAKind",
        VALUES.indexOf(Object.keys(cardValCount)[0]),
        VALUES.indexOf(Object.keys(cardValCount)[1]),
        VALUES.indexOf(Object.keys(cardValCount)[2]),
      ];
    }

    // 2 pairs
    if (this.checkTwoPairs(cardValCount)){
      return [8,
        "TwoPairs",
        VALUES.indexOf(Object.keys(cardValCount)[0]),
        VALUES.indexOf(Object.keys(cardValCount)[1]),
        VALUES.indexOf(Object.keys(cardValCount)[2]),
      ];
    }

    // 1 pair
    if (this.checkOnePair(cardValCount)) {
      return [9, 
        "OnePair",
        VALUES.indexOf(Object.keys(cardValCount)[0]),
        VALUES.indexOf(Object.keys(cardValCount)[1]),
        VALUES.indexOf(Object.keys(cardValCount)[2]),
        VALUES.indexOf(Object.keys(cardValCount)[3]),
      ];
    }
    // high cards
    return [10, 
      "HighCard",
      VALUES.indexOf(Object.keys(cardValCount)[0]),
      VALUES.indexOf(Object.keys(cardValCount)[1]),
      VALUES.indexOf(Object.keys(cardValCount)[2]),
      VALUES.indexOf(Object.keys(cardValCount)[3]),
      VALUES.indexOf(Object.keys(cardValCount)[4]),
    ];
  }

  
  // function to get best 5 card combo out of hole cards + 5 board cards
  compareTwoCombos(combo1, combo2){
    let strength1 = this.handStrength(combo1)
    let strength2 = this.handStrength(combo2)
    if (strength1[0] < strength2[0]) {
      return 1;
    } else if (strength1[0] > strength2[0]){
      return -1;
    } else {
      return this.tieBreaker(strength1, strength2);
    }
  }

  tieBreaker(strength1, strength2){
    let rank = strength1[0];
    switch (rank) {
      case 1: return 0;
      case 2:
        return this.TB2(strength1, strength2);
      case 3: 
        return this.TB3(strength1, strength2);
      case 4:
        return this.TB4(strength1, strength2);
      case 5:
        return this.TB5(strength1, strength2);
      case 6:
        return this.TB2(strength1, strength2);
      case 7:
        return this.TB7(strength1, strength2);
      case 8:
        return this.TB8(strength1, strength2);
      case 9:
        return this.TB9(strength1, strength2);
      case 10:
        return this.TB10(strength1, strength2);
      default: return 0;
    }
  }

  bestFive(hand, boardCards){
    let combos = this.fiveCardCombos(hand, boardCards)
    let best = combos[0];
    for (let i=1; i<combos.length; i++){
      if (this.compareTwoCombos(combos[i],best) === 1) best = combos[i];
    }
    return best;
  }

  // main function to compare two hands
  compareTwoHands(hand1, hand2, boardCards){
    let best1 = this.bestFive(hand1, boardCards);
    let best2 = this.bestFive(hand2, boardCards);
    switch (this.compareTwoCombos(best1, best2)){
      case 1:
        return 1;
      case -1:
        return -1;
      default:
        return 0
    }
  }

  // function to get rest of deck from hand1, hand2 and community cards
  remainingCards(hand1, hand2, communityCards, deck){
    let cardsLeft = deck.cards.slice(0);
    let cardsDealt = hand1.concat(hand2, communityCards)
    cardsDealt.forEach(card =>{
      for(let i = 0; i<cardsLeft.length; i++){
        if (cardsLeft[i].value===card.value && cardsLeft[i].suit === card.suit) {
          cardsLeft.splice(i, 1);
          break;
        }
      }
    })
    return cardsLeft;
  }

  // flopCards(hand1, hand2, deck){
  //   let cardsLeft = this.remainingCards(hand1, hand2, [], deck);
  //   let flop = [];
  //   while (flop.length <3){
  //     let idx = Math.floor(Math.random()*cardsLeft.length);
  //     flop.push(cardsLeft[idx]);
  //     cardsLeft.splice(idx, 1);
  //   }
  //   return flop;
  // }
  
  // turnCard(hand1, hand2, flopCards, deck){
  //   let cardsLeft = this.remainingCards(hand1, hand2, flopCards, deck);
  //   let idx = Math.floor(Math.random() * cardsLeft.length);
  //   return cardsLeft[idx];
  // }

  // riverCard(hand1, hand2, communityCards, deck){
  //   let cardsLeft = this.remainingCards(hand1, hand2, communityCards, deck);
  //   let idx = Math.floor(Math.random() * cardsLeft.length);
  //   return cardsLeft[idx];
  // }

  preflopProp(hand1, hand2, deck){
    let cardsLeft = this.remainingCards(hand1, hand2, [], deck);
    let fiveCardCombos = this.comboMaker(cardsLeft, 5);
    let winCount = 0;
    let loseCount = 0;
    let tieCount = 0;
    console.log(fiveCardCombos.length);
    fiveCardCombos.forEach(fiveCardCombo => {
      switch (this.compareTwoHands(hand1, hand2, fiveCardCombo)) {
        case 1:
          winCount += 1;
          break;
        case (-1):
          loseCount += 1;
          break;
        default:
          tieCount += 1;
          break;
      }
    })
    let total = fiveCardCombos.length
    return [winCount / total, loseCount / total, tieCount / total]
  }
  

  flopProp(hand1, hand2, flopCards, deck){
    let cardsLeft = this.remainingCards(hand1, hand2, flopCards, deck);
    let trCombos = this.comboMaker(cardsLeft, 2);
    let winCount = 0;
    let loseCount = 0;
    let tieCount = 0;
    trCombos.forEach(trCombo => {
      let boardCards = flopCards.concat(trCombo);
      switch (this.compareTwoHands(hand1, hand2, boardCards)) {
        case 1:
          winCount += 1;
          break;
        case (-1):
          loseCount += 1;
          break;
        default:
          tieCount += 1;
          break;
      }
    })
    return [winCount, loseCount, tieCount];
  }


  turnProp(hand1, hand2, communityCards, deck){
    let riverCards = this.remainingCards(hand1, hand2, communityCards, deck);
    let winCount = 0;
    let loseCount = 0;
    let tieCount = 0;
    riverCards.forEach(riverCard => {
      let boardCards = communityCards.concat(riverCard);
      switch (this.compareTwoHands(hand1, hand2, boardCards)){
        case 1:
          winCount += 1;
          break;
        case (-1):
          loseCount += 1;
          break;
        default:
          tieCount +=1;
          break;
      }
    })
    return [winCount, loseCount, tieCount];
  }

  riverProp(hand1, hand2, communityCards){
    switch (this.compareTwoHands(hand1, hand2, communityCards)) {
      case 1:
        return [1,0,0];
      case (-1):
        return [0,1,0];
      default:
        return [0,0,1];
    }
  }

  flopPropAgainstRange(hand1, range, communityCards, deck){
    let winCount = 0;
    let loseCount = 0;
    let tieCount = 0;
    range.forEach(hand2 => {
      let outcome = this.flopProp(hand1, hand2, communityCards, deck);
      winCount += outcome[0];
      loseCount += outcome[1];
      tieCount += outcome[2];
    })
    let total = winCount + loseCount + tieCount;
    return [winCount / total, loseCount / total, tieCount / total];
  }


  turnPropAgainstRange(hand1, range, communityCards, deck){
    let winCount = 0;
    let loseCount = 0;
    let tieCount = 0;
    range.forEach(hand2 => {
      let outcome = this.turnProp(hand1, hand2, communityCards, deck);
      winCount += outcome[0];
      loseCount += outcome[1];
      tieCount += outcome[2];
    })
    let total = winCount + loseCount + tieCount;
    return [winCount / total, loseCount / total, tieCount / total];
  }


  riverPropAgainstRange(hand1, range, communityCards){
    let winCount = 0;
    let loseCount = 0;
    let tieCount = 0;
    range.forEach(hand2 => {
      let outcome = this.riverProp(hand1, hand2, communityCards);
      winCount += outcome[0];
      loseCount += outcome[1];
      tieCount += outcome[2];
    })
    let total = winCount + loseCount + tieCount;
    return [winCount / total, loseCount / total, tieCount / total];
  }
  

  //--------helper functions to check hand strength-----------//
  checkFlush(handSuits) {
    return [...new Set(handSuits)].length === 1
  }

  checkStraight(sortedHandValues) {
    let aceStragith = ["2", "3", "4", "5", "A"];
    //check ace straight
    if (sortedHandValues.join("") === aceStragith.join("")) {
      return true;
    }

    let startIdx = VALUES.indexOf(sortedHandValues[0]);

    for (let i = 1; i < sortedHandValues.length; i++) {
      if (sortedHandValues[i] !== VALUES[startIdx + i]) {
        return false;
      }
    }
    return true;
  }

  checkFourOfKind(cardValCount) {
    if (Object.values(cardValCount).includes(4)) return true;
    return false;
  }

  checkFullHouse(cardValCount) {
    if (Object.values(cardValCount).includes(3) && Object.values(cardValCount).includes(2)) return true;
    return false;
  }

  checkThreeOfKind(cardValCount) {
    if (Object.values(cardValCount).includes(3) && !Object.values(cardValCount).includes(2)) return true;
  }

  checkTwoPairs(cardValCount) {
    if (Object.values(cardValCount).includes(2) && Object.keys(cardValCount).length === 3) return true;
  }

  checkOnePair(cardValCount) {
    if (Object.values(cardValCount).includes(2) && Object.keys(cardValCount).length === 4) return true;
  }

  //-------------------------------------------------------//


  //--------helper functions to for hand strength tie breaker-----------//
  // straight flush and straight tie breaker
  TB2(stg1, stg2) {
    if (stg1[2] > stg2[2]) return 1;
    if (stg1[2] === stg2[2]) return 0;
    if (stg1[2] < stg2[2]) return -1;
  }

  // four of kind tie breaker
  TB3(stg1, stg2) {
    if (stg1[3] > stg2[3]) return 1;
    if (stg1[3] === stg2[3]) return 0;
    if (stg1[3] < stg2[3]) return -1;
  }

  // full house tie breaker
  TB4(stg1, stg2) {
    if (stg1[2] > stg2[2]) return 1;
    if (stg1[2] === stg2[2]) {
      if (stg1[3] > stg2[3]) return 1;
      if (stg1[3] === stg2[3]) return 0;
      if (stg1[3] < stg2[3]) return -1;
    }
    if (stg1[2] < stg2[2]) return -1;
  }

  // flush tie breaker
  TB5(stg1, stg2) {
    let val1 = stg1.slice(2);
    let val2 = stg2.slice(2);
    for (let i = 0; i < val1.length; i++) {
      if (val1[i] > val2[i]) return 1;
      if (val1[i] < val2[i]) return -1;
    }
    return 0;
  }

  // 3 of kind tie breaker
  TB7(stg1, stg2) {
    if (stg1[2] > stg2[2]) {
      return 1;
    } else if (stg1[2] < stg2[2]) {
      return -1;
    } else {
      let val1 = this.sortHandValues(stg1.slice(3));
      let val2 = this.sortHandValues(stg2.slice(3));
      for (let i = val1.length - 1; i >= 0; i--) {
        if (val1[i] > val2[i]) return 1;
        if (val1[i] < val2[i]) return -1;
      }
      return 0;
    }
  }

  // 2 pairs tie breaker
  TB8(stg1, stg2) {
    let pairs1 = this.sortHandValues(stg1.slice(2, 4));
    let pairs2 = this.sortHandValues(stg2.slice(2, 4));
    for (let i = pairs1.length - 1; i >= 0; i--) {
      if (pairs1[i] > pairs2[i]) {
        return 1;
      } else if (pairs1[i] < pairs2[i]) {
        return -1;
      } else {
        if (stg1[4] > stg2[4]) return 1;
        if (stg1[4] < stg2[4]) return -1;
        return 0;
      }
    }
  }

  // 1 pair tie breaker
  TB9(stg1, stg2) {
    if (stg1[2] > stg2[2]) {
      return 1;
    } else if (stg1[2] < stg2[2]) {
      return -1;
    } else {
      let val1 = this.sortHandValues(stg1.slice(3))
      let val2 = this.sortHandValues(stg2.slice(3))
      for (let i = val1.length - 1; i >= 0; i--) {
        if (val1[i] > val2[i]) return 1;
        if (val1[i] < val2[i]) return -1;
      }
      return 0;
    }
  }

  // high card tie breaker
  TB10(stg1, stg2) {
    let val1 = this.sortHandValues(stg1.slice(2))
    let val2 = this.sortHandValues(stg2.slice(2))
    for (let i = val1.length - 1; i >= 0; i--) {
      if (val1[i] > val2[i]) return 1;
      if (val1[i] < val2[i]) return -1;
    }
    return 0;
  }

  //-------------------------------------------------------//


  //--------------More helper function---------------------//
  comboMaker(arr, targetLength){
    let result = [];

    function dfs(current, start) {
      if (current.length === targetLength) {
        result.push(current);
        return
      }
      if (current.length > targetLength) {
        return;
      }

      for (let i=start; i<arr.length; i++){
        dfs(current.concat(arr[i]), i+1);
      }
    }

    dfs([], 0);
    return result;
  }

  sortHandValues(arr) {
    let sorted = false;
    while (!sorted) {
      sorted = true;
      for (let i = 0; i < arr.length - 1; i++) {
        if (VALUES.indexOf(arr[i]) > VALUES.indexOf(arr[i + 1])) {
          [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
          sorted = false;
        }
      }
    }
    return arr;
  }

  getCardValByCount(countObj, count) {
    return Object.keys(countObj).find(key => countObj[key] === count);
  }

}


export default Calculator;



// function tb(n1, n2){
//   switch (n1-n2){
//     case 0:
//       return 0;
//     case 1:
//       if (n1===2) return n1;
//       return n2;
//     case 2:
//       return n2;
//     default:
//       return n1*n2;
//   }
// }