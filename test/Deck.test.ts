import { describe, it, expect, beforeAll } from "vitest";
import { Deck, type Card, suitEnum } from "../src/Deck";

describe("Standard deck generation", () => {
  let testDeck: Deck;

  beforeAll(() => {
    testDeck = new Deck();
  });

  it("has 13 cards of each suit", () => {
    for (const suit of [
      suitEnum.clubs,
      suitEnum.diamonds,
      suitEnum.spades,
      suitEnum.hearts,
    ]) {
      const collectedSuit = testDeck.sortedDeck.filter(
        (card: Card) => card.suit === suit,
      );
      expect(collectedSuit).toHaveLength(13);
    }
  });

  it("has 2 jokers", () => {
    const jokers = testDeck.sortedDeck.filter(
      (card: Card) => card.suit === suitEnum.joker,
    );

    expect(jokers).toHaveLength(2);
  });
});

describe("Shuffled deck generation", () => {
  let testDeck: Deck;

  beforeAll(() => {
    testDeck = new Deck();
  });

  it("has 13 cards of each suit", () => {
    for (const suit of [
      suitEnum.clubs,
      suitEnum.diamonds,
      suitEnum.spades,
      suitEnum.hearts,
    ]) {
      const collectedSuit = testDeck.shuffledDeck.filter(
        (card: Card) => card.suit === suit,
      );
      expect(collectedSuit).toHaveLength(13);
    }
  });

  it("has 2 jokers", () => {
    const jokers = testDeck.shuffledDeck.filter(
      (card: Card) => card.suit === suitEnum.joker,
    );

    expect(jokers).toHaveLength(2);
  });

  it("has different order for both", () => {
    expect(
      JSON.stringify(testDeck.sortedDeck) !==
        JSON.stringify(testDeck.shuffledDeck),
    );
  });
});
