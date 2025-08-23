import { shuffleArray } from "./mosaicUtils";

export type Suit = "clubs" | "diamonds" | "spades" | "hearts" | "joker";

export const enum suitEnum {
  clubs = "clubs",
  diamonds = "diamonds",
  spades = "spades",
  hearts = "hearts",
  joker = "joker",
}

export interface Card {
  readonly rank: number;
  readonly suit: Suit;
}

export class Deck {
  sortedDeck: Card[];
  shuffledDeck: Card[];

  createSortedDeck(): Card[] {
    const sortedDeck: Card[] = [];
    for (const s of ["clubs", "diamonds", "spades", "hearts"] as Suit[]) {
      for (let i = 1; i <= 13; i++) {
        sortedDeck.push({ rank: i, suit: s });
      }
    }
    // add two jokers
    sortedDeck.push({ rank: 0, suit: "joker" });
    sortedDeck.push({ rank: 0, suit: "joker" });

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
