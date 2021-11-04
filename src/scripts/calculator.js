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
  // fiveCardCombos(hand, boardCards){
  //   let cards = hand.concat(boardCards);
  //   let combos = this.comboMaker(cards, 5);
  //   return combos;
  // }

  // main function to get hand strength of any five cards
  // handStrength(fiveCards){
  handStrength(sevenCards){
    let handValues = this.sortHandValues(sevenCards.map(card => card.value));
    let uniqVals = this.uniqValues(handValues)
    // this.sortHandValues(uniqVals);
    let handSuits = sevenCards.map(card => card.suit);
    // count card values
    let cardValCount = {};
    handValues.forEach(val => {
      if (cardValCount[val] === undefined) {
        cardValCount[val] = 1;
      } else {
        cardValCount[val] += 1;
      }
    })

    let suitCount = {};
    handSuits.forEach(suit => {
      if (suitCount[suit] === undefined) {
        suitCount[suit] = 1;
      } else {
        suitCount[suit] += 1;
      }
    })
    //check royal flush
    if (uniqVals.join("").includes("10JQKA") && this.checkStraightFlush("A", sevenCards)) {
      return [1, "RoyalFlush"];
    }

    //check straight flush
    let kicker = this.checkStraight(uniqVals);
    if (kicker !=="none" && this.checkStraightFlush(kicker, sevenCards)){
      return [2, 
        "StraightFlush", 
        VALUES.indexOf(kicker)];
    }
    
    //check 4 of a kind
    if (this.checkFourOfKind(cardValCount)) {
      let four = this.getCardValByCount(cardValCount, 4);
      let kickers = uniqVals.filter(el=> el!==four);
      return [3, 
        "FourOfAKind",
        VALUES.indexOf(four),
        VALUES.indexOf(kickers[kickers.length - 1])
      ]
    }

    //full house
    if (this.checkFullHouse(cardValCount)) {
      let threeVals = [];
      let kickers = [];
      let kicker;
      let three;
      for (let i = 1; i < handValues.length; i++) {
        if (handValues[i] === handValues[i - 1] && handValues[i] === handValues[i+1]) {
          if (!threeVals.includes(handValues[i])) threeVals.push(handValues[i]);
        } else if (handValues[i] === handValues[i - 1] || handValues[i] === handValues[i + 1]){
          if (!kickers.includes(handValues[i])) kickers.push(handValues[i]);
        }
      }
      if (threeVals.length > 1) {
        kicker = threeVals.shift();
        three = threeVals[0];
      } else {
        for(let i=kickers.length-1; i>=0; i--){
          if (kickers[i] !== three) {
            kicker = kickers[i];
            break;
          }
        }
      }
      return [4, 
        "FullHouse", 
        VALUES.indexOf(three),
        VALUES.indexOf(kicker)
      ];




      // let three = this.getCardValByCount(cardValCount, 3);
      // let kicker;
      // if (Object.values(cardValCount).includes(1)){
      //   kicker = this.getCardValByCount(cardValCount, 2);
      // } else {
      //   let pairs = uniqVals.filter(el=> el!==three);
      //   this.sortHandValues(pairs);
      //   kicker = pairs[pairs.length-1];
      // }
      // return [4, 
      //   "FullHouse", 
      //   VALUES.indexOf(three),
      //   VALUES.indexOf(kicker)
      // ];
    }

    
    //flush
    if (this.checkFlush(suitCount)){
      let s = this.getCardValByCount(suitCount, 5) || this.getCardValByCount(suitCount, 6) || this.getCardValByCount(suitCount, 7);
      let flushVals = sevenCards.filter(card => card.suit === s ).map(card => card.value);
      this.sortHandValues(flushVals);
      let endIdx = flushVals.length-1;
      return [5,
        "Flush",
        VALUES.indexOf(flushVals[endIdx]),
        VALUES.indexOf(flushVals[endIdx-1]),
        VALUES.indexOf(flushVals[endIdx-2]),
        VALUES.indexOf(flushVals[endIdx-3]),
        VALUES.indexOf(flushVals[endIdx-4]),
      ];
    }
    
    //check straight
    if (this.checkStraight(uniqVals) !== "none"){
      return [6, 
        "Straight",
        VALUES.indexOf(this.checkStraight(uniqVals))
      ]
    }
    
    //three of a kind
    if (this.checkThreeOfKind(cardValCount)){
      let three = this.getCardValByCount(cardValCount, 3);
      let kickers = uniqVals.filter(el => el !== three);
      this.sortHandValues(kickers);
      return [7, 
        "ThreeOfAKind",
        VALUES.indexOf(three),
        VALUES.indexOf(kickers[3]),
        VALUES.indexOf(kickers[2])
      ];
    }
    
    // 2 pairs
    if (this.checkTwoPairs(cardValCount)){
      let pairVals = [];
      let kickers = [];
      for(let i=0; i<handValues.length; i++){
        if (handValues[i] === handValues[i+1] || handValues[i-1] === handValues[i]){
          if (!pairVals.includes(handValues[i])) pairVals.push(handValues[i]);
        } else {
          kickers.push(handValues[i]);
        }
      }
      this.sortHandValues(pairVals);
      this.sortHandValues(kickers);
      return [8,
        "TwoPairs",
        VALUES.indexOf(pairVals[pairVals.length-1]),
        VALUES.indexOf(pairVals[pairVals.length-2]),
        VALUES.indexOf(kickers[kickers.length-1])
      ];
    }

    // 1 pair
    if (this.checkOnePair(cardValCount)) {
      let pairVal = this.getCardValByCount(cardValCount, 2);
      let kickers = handValues.filter(el=>el!==pairVal);
      this.sortHandValues(kickers);
      return [9, 
        "OnePair",
        VALUES.indexOf(pairVal),
        VALUES.indexOf(kickers[4]),
        VALUES.indexOf(kickers[3]),
        VALUES.indexOf(kickers[2])
      ];
    }
    // high cards
    return [10, 
      "HighCard",
      VALUES.indexOf(Object.keys(cardValCount)[6]),
      VALUES.indexOf(Object.keys(cardValCount)[5]),
      VALUES.indexOf(Object.keys(cardValCount)[4]),
      VALUES.indexOf(Object.keys(cardValCount)[3]),
      VALUES.indexOf(Object.keys(cardValCount)[2])
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

  // bestFive(hand, boardCards){
  //   let combos = this.fiveCardCombos(hand, boardCards)
  //   let best = combos[0];
  //   for (let i=1; i<combos.length; i++){
  //     if (this.compareTwoCombos(combos[i],best) === 1) best = combos[i];
  //   }
  //   return best;
  // }

  // main function to compare two hands
  compareTwoHands(hand1, hand2, boardCards){
    let seven1 = hand1.concat(boardCards);
    let seven2 = hand2.concat(boardCards);
    switch (this.compareTwoCombos(seven1, seven2)){
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

  preflopProp(hand1, hand2, deck, iterations=10000){
    let cardsLeft = this.remainingCards(hand1, hand2, [], deck);
    let fiveCardCombos = this.comboMaker(cardsLeft, 5);
    let winCount = 0;
    let loseCount = 0;
    let tieCount = 0;
    let total = 0;
    while (total < iterations) {
      let randomIdx = Math.floor(Math.random()*fiveCardCombos.length);
      total += 1;
      switch (this.compareTwoHands(hand1, hand2, fiveCardCombos[randomIdx])){
      // fiveCardCombos.forEach(fiveCardCombo => {
      //   switch (this.compareTwoHands(hand1, hand2, fiveCardCombo)) {
          case 1:
            winCount += 1;
            break;
          case (-1):
            loseCount += 1;
            break;
          default:
            tieCount += 1;
            break;
      // })
      }
    }
    total = fiveCardCombos.length;
    return [winCount, loseCount, tieCount]
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

  preflopPropAgainstRange(hand1, range, deck) {
    let winCount = 0;
    let loseCount = 0;
    let tieCount = 0;
    range.forEach(hand2 => {
      let outcome = this.preflopProp(hand1, hand2, deck);
      winCount += outcome[0];
      loseCount += outcome[1];
      tieCount += outcome[2];
    })
    let total = winCount + loseCount + tieCount;
    return [winCount / total, loseCount / total, tieCount / total, total];
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
    return [winCount / total, loseCount / total, tieCount / total, total];
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
    return [winCount / total, loseCount / total, tieCount / total, total];
  }

  getResult(hand1, range, communityCards, deck){
    switch (communityCards.length){
      case 0:
        return this.preflopPropAgainstRange(hand1, range, deck);
      case 3:
        return this.flopPropAgainstRange(hand1, range, communityCards, deck);
      case 4:
        return this.turnPropAgainstRange(hand1, range, communityCards, deck);
      default:
        return this.riverPropAgainstRange(hand1, range, communityCards, deck);
    }
  }


  //--------helper functions to check hand strength-----------//
  checkFlush(suitCount) {
    if (Object.values(suitCount).includes(5) || Object.values(suitCount).includes(6) || 
      Object.values(suitCount).includes(7)) {
      return true;
    } else {
      return false;
    }
  }

  checkStraightFlush(kicker, sevenCards) {
    let cards = []
    let cardValIdx = []
    let straightEndIdx;
    if (kicker === "5"){
      straightEndIdx = VALUES.indexOf(kicker);
      cardValIdx.push(straightEndIdx);
      let idx;
      for (let i=1; i<4; i++){
        idx = straightEndIdx - i;
        cardValIdx.unshift(idx);
        cardValIdx.unshift(12);
      }
    } else {
      straightEndIdx = VALUES.indexOf(kicker);
      cardValIdx.push(straightEndIdx);
      let idx;
      for (let i = 1; i < 5; i++) {
        idx = straightEndIdx - i;
        cardValIdx.unshift(idx);
      }
    }
    let cardVals = cardValIdx.map(idx => VALUES[idx])
    for(let i=0; i<7; i++){
      if (cardVals.includes(sevenCards[i].value)) {
        cards.push(sevenCards[i])
      }
    }
    let suitCount = {};
    cards.forEach(card => {
      if (suitCount[card.suit] === undefined) {
        suitCount[card.suit] = 1;
      } else {
        suitCount[card.suit] += 1;
      }
    })
    return this.checkFlush(suitCount);
  }

  checkStraight(uniqVals) {
    let kicker = "none"
    let aceStragith = ["2", "3", "4", "5", "A"];
    //check ace straight
    if (uniqVals.join("").includes(aceStragith.join(""))) {
      kicker = "A";
    }

    if (uniqVals.length === 5){
      let startIdx = VALUES.indexOf(uniqVals[0]);
      if (uniqVals.join("") === VALUES.slice(startIdx, startIdx + 5).join("")){
        kicker = uniqVals[4];
      }
    } else if (uniqVals.length === 6){
      let startIdx1 = VALUES.indexOf(uniqVals[0]);
      let startIdx2 = VALUES.indexOf(uniqVals[1]);
      if (uniqVals.slice(0, 5).join("") === VALUES.slice(startIdx1, startIdx1 + 5).join("")){
        kicker = uniqVals[4];
      }
      if (uniqVals.slice(1).join("") === VALUES.slice(startIdx2, startIdx2 + 5).join("")){
        kicker = uniqVals[5];
      }
    } else {
      let startIdx1 = VALUES.indexOf(uniqVals[0]);
      let startIdx2 = VALUES.indexOf(uniqVals[1]);
      let startIdx3 = VALUES.indexOf(uniqVals[2]);
      if (uniqVals.slice(0, 5).join("") === VALUES.slice(startIdx1, startIdx1 + 5).join("")){
        kicker = uniqVals[4];
      }
      if (uniqVals.slice(1, 6).join("") === VALUES.slice(startIdx2, startIdx2 + 5).join("")){
        kicker = uniqVals[5];
      }
      if (uniqVals.slice(2).join("") === VALUES.slice(startIdx3, startIdx3 + 5).join("")) {
        kicker = uniqVals[6];;
      }
    }
    return kicker;
  }

  checkFourOfKind(cardValCount) {
    if (Object.values(cardValCount).includes(4)) return true;
    return false;
  }

  checkFullHouse(cardValCount) {
    if (Object.values(cardValCount).includes(3) && Object.keys(cardValCount).length < 5) return true;
    return false;
  }

  checkThreeOfKind(cardValCount) {
    if (Object.values(cardValCount).includes(3) && !Object.values(cardValCount).includes(2)) return true;
    return false;
  }

  checkTwoPairs(cardValCount) {
    if (Object.values(cardValCount).sort().join("").includes("22")) return true;
    return false;
  }

  checkOnePair(cardValCount) {
    if (Object.values(cardValCount).includes(2) && !this.checkTwoPairs(cardValCount)) return true;
    return false;
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
    if (stg1[2] > stg2[2]) return 1;
    if (stg1[2] === stg2[2]) {
      if (stg1[3] > stg2[3]) return 1;
      if (stg1[3] === stg2[3]) return 0;
      if (stg1[3] < stg2[3]) return -1;
    }
    if (stg1[2] < stg2[2]) return -1;
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
      let val1 = stg1.slice(3);
      let val2 = stg2.slice(3);
      for (let i = 0; i < val1.length; i++) {
        if (val1[i] > val2[i]) return 1;
        if (val1[i] < val2[i]) return -1;
      }
      return 0;
    }
  }

  // 2 pairs tie breaker
  TB8(stg1, stg2) {
    if (stg1[2] > stg2[2]) {
      return 1;
    } else if (stg1[2] < stg2[2]) {
      return -1;
    } else {
      if (stg1[3] > stg2[3]) {
        return 1;
      } else if (stg1[3] < stg2[3]) {
        return -1;
      }
    }
    return 0;
  }

  // 1 pair tie breaker
  TB9(stg1, stg2) {
    if (stg1[2] > stg2[2]) {
      return 1;
    } else if (stg1[2] < stg2[2]) {
      return -1;
    } else {
      let val1 = stg1.slice(3)
      let val2 = stg2.slice(3)
      for (let i = 0; i < val1.length; i++) {
        if (val1[i] > val2[i]) return 1;
        if (val1[i] < val2[i]) return -1;
      }
      return 0;
    }
  }

  // high card tie breaker
  TB10(stg1, stg2) {
    let val1 = stg1.slice(2)
    let val2 = stg2.slice(2)
    for (let i = 0; i < val1.length; i++) {
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

  uniqValues(arr){
    return [...new Set(arr)];
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