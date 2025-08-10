import { Deck, type Card } from "./Deck";

const RESOURCE_COUNT = 5;

export class SurvivalBlackjack {
  resourceCount = RESOURCE_COUNT;
  deck = new Deck();
  resources: Card[] = [];
  discard: Card[] = [];
  playerHand: Card[] = [];
  playerScore: number = 0;
  dealerHand: Card[] = [];
  dealerScore: number = 0;
  drawIter: ArrayIterator<Card> = this.deck.shuffledDeck.values();

  /**
   * Pull n cards from the game deck.
   * @param {number} number of cards to draw
   * @returns {Cards[]} array of Card objects
   * @modifies this.drawIter state
   */
  take(n: number): Card[] {
    const drawnCards: Card[] = [];
    for (let i = 0; i < n; i++) {
      const next = this.drawIter.next();
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
  setup() {
    this.resources = this.take(this.resourceCount);
  }

  /**
   * Score a single card:
   *  - face cards: 10
   *  - ace: 1
   *  - joker: 0
   * @param {Card} card
   * @returns {number} score
   */
  blackjackScoreCard(card: Card): number {
    return Math.min(card.rank, 10);
  }

  /**
   * Calculate score for a complete hand.
   * Handles scoring of aces based on hand total.
   * @param {Cards[]} cards - Array of cards
   * @returns {number} score
   */
  blackjackScoreHand(cards: Card[]): number {
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
        return sum + this.blackjackScoreCard(curr);
      }
    }, 0);
  }

  startTurn() {
    this.playerHand = this.take(2);
    this.dealerHand = this.take(2);
  }

  playerDraw(deckExhaustedHook: () => void): boolean {
    const next = this.drawIter.next();
    if (next.value) {
      this.playerHand.push(next.value);
      return true;
    } else {
      deckExhaustedHook();
      return false;
    }
  }

  dealerDraw(deckExhaustedHook: () => void): boolean {
    const next = this.drawIter.next();
    if (next.value) {
      this.dealerHand.push(next.value);
      return true;
    } else {
      deckExhaustedHook();
      return false;
    }
  }

  dealerDrawTo17(deckExhaustedHook: () => void) {
    while (this.blackjackScoreHand(this.dealerHand) < 17) {
      if (!this.dealerDraw(deckExhaustedHook)) {
        break;
      }
    }
  }

  scoreTurn(): void {
    const pScore = this.blackjackScoreHand(this.playerHand);
    const dScore = this.blackjackScoreHand(this.dealerHand);

    // player goes bust
    if (pScore > 21) {
      this.dealerScore++;
    } else if (dScore > 21) {
      // dealer goes bust
      this.playerScore++;
    } else if (pScore > dScore) {
      // player wins
      this.playerScore++;
    } else if (dScore > pScore) {
      // dealer wins
      this.dealerScore++;
    }
  }
}
