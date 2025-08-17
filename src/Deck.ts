import { shuffleArray } from "./mosaicUtils";

export const enum suitEnum {
  clubs,
  diamonds,
  spades,
  hearts,
  joker,
}

export interface Card {
  readonly rank: number;
  readonly suit: suitEnum;
}

export class Deck {
  sortedDeck: Card[];
  shuffledDeck: Card[];

  createSortedDeck(): Card[] {
    const sortedDeck: Card[] = [];
    for (const s of [
      suitEnum.clubs,
      suitEnum.diamonds,
      suitEnum.spades,
      suitEnum.hearts,
    ]) {
      for (let i = 1; i <= 13; i++) {
        sortedDeck.push({ rank: i, suit: s });
      }
    }
    // add two jokers
    sortedDeck.push({ rank: 0, suit: suitEnum.joker });
    sortedDeck.push({ rank: 0, suit: suitEnum.joker });

    return sortedDeck;
  }

  constructor() {
    this.sortedDeck = this.createSortedDeck();
    this.shuffledDeck = shuffleArray([...this.sortedDeck]);
  }

  shuffle() {
    this.shuffledDeck = shuffleArray([...this.sortedDeck]);
  }
}
