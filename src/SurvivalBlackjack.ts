import { Deck, type Card } from "./Deck";
import { produce, immerable } from "immer";

const RESOURCE_COUNT = 5;

export const enum turnStage {
  start,
  playerTurn,
  dealerTurn,
  score,
  endgame,
  finish,
}

export class SurvivalBlackjack {
  [immerable] = true;
  resourceCount = RESOURCE_COUNT;
  resources: Card[] = [];
  discard: Card[] = [];
  playerHand: Card[] = [];
  playerScore: number = 0;
  dealerHand: Card[] = [];
  dealerScore: number = 0;
  stage: turnStage = turnStage.start;
  losingStreak: number = 0;
}

/**
 * Pull n cards from the game deck.
 * @param {ArrayIterator<Card>} iter
 * @param {number} n number of cards to draw
 * @returns {Cards[]} array of Card objects
 * @modifies this.drawIter state
 */
export function take(iter: ArrayIterator<Card>, n: number): Card[] {
  const drawnCards: Card[] = [];
  for (let i = 0; i < n; i++) {
    const next = iter.next();
    switch (next.value) {
      case undefined:
        return drawnCards;
      default:
        drawnCards.push(next.value);
    }
  }
  return drawnCards;
}

/**
 * Set up the game allocating resources to the player.
 * @modifies this.resources
 */
export function setup(
  game: SurvivalBlackjack,
  shuffledDeck: ArrayIterator<Card>,
  resourceCount: number = RESOURCE_COUNT,
): SurvivalBlackjack {
  return produce(game, (game) => {
    game.resources = take(shuffledDeck, resourceCount);
  });
}

/**
 * Score a single card:
 *  - face cards: 10
 *  - ace: 1
 *  - joker: 0
 * @param {Card} card
 * @returns {number} score
 */
export function blackjackScoreCard(card: Card): number {
  return Math.min(card.rank, 10);
}

/**
 * Calculate score for a complete hand.
 * Handles scoring of aces based on hand total.
 * @param {Cards[]} cards - Array of cards
 * @returns {number} score
 */
export function blackjackScoreHand(cards: Card[]): number {
  // sort aces to the back
  const sorted = [...cards];
  sorted.sort((a, b) => {
    if (a.rank === 1 && b.rank !== 1) return 1;
    if (b.rank === 1 && a.rank !== 1) return -1;
    return 0;
  });

  return sorted.reduce((sum: number, curr: Card) => {
    if (curr.rank === 1 && sum <= 10) {
      return sum + 11;
    } else {
      return sum + blackjackScoreCard(curr);
    }
  }, 0);
}

/**
 * Start a new turn, dealing two cards to player and dealer.
 * @param {game: SurvivalBlackjack} game: old game state
 * @returns {game: SurvivalBlackjack} new game state
 */
export function startTurn(
  game: SurvivalBlackjack,
  drawPile: ArrayIterator<Card>,
): SurvivalBlackjack {
  return produce(game, (game) => {
    game.playerHand = take(drawPile, 2);
    game.dealerHand = take(drawPile, 2);
  });
}

// /**
//  * Draw a single card from the draw pile and add to player hand.
//  * @param {function} deckExhaustedHook function to call if deck is exhausted
//  * @modifies playerHand
//  * @modifies drawIter state
//  * @returns {boolean} true if card has been drawn.
//  */
// playerDraw(deckExhaustedHook: () => void): boolean {
//   const next = this.drawIter.next();
//   if (next.value) {
//     this.playerHand.push(next.value);
//     return true;
//   } else {
//     deckExhaustedHook();
//     return false;
//   }
// }

// /**
//  * Draw a single card from the draw pile and add to dealer hand.
//  * @param {function} deckExhaustedHook function to call if deck is exhausted
//  * @modifies dealerHand
//  * @modifies drawIter state
//  * @returns {boolean} true if card has been drawn.
//  */
// dealerDraw(deckExhaustedHook: () => void): boolean {
//   const next = this.drawIter.next();
//   if (next.value) {
//     this.dealerHand.push(next.value);
//     return true;
//   } else {
//     deckExhaustedHook();
//     return false;
//   }
// }

// /**
//  * Draw repeatedly until dealer minimum is reached
//  * @modifies dealerHand
//  * @modifies drawIter state
//  * @param deckExhaustedHook
//  */
// dealerDrawTo17(deckExhaustedHook: () => void) {
//   while (this.blackjackScoreHand(this.dealerHand) < 17) {
//     if (!this.dealerDraw(deckExhaustedHook)) {
//       break;
//     }
//   }
// }
// /**
//  * Scores turn:
//  * - 1 point to player if dealer goes bust
//  * - 1 point to player if dealer sum is less than player sum
//  * - 1 point to dealer if player goes bust
//  * - 1 point to dealer if player sum less than dealer sum
//  * @modifies playerScore
//  * @modifies dealerScore
//  */
// scoreTurn(): void {
//   const pScore = this.blackjackScoreHand(this.playerHand);
//   const dScore = this.blackjackScoreHand(this.dealerHand);

//   // player goes bust
//   if (pScore > 21) {
//     this.dealerScore++;
//   } else if (dScore > 21) {
//     // dealer goes bust
//     this.playerScore++;
//   } else if (pScore > dScore) {
//     // player wins
//     this.playerScore++;
//   } else if (dScore > pScore) {
//     // dealer wins
//     this.dealerScore++;
//   }
// }
