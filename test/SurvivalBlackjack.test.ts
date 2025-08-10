import { SurvivalBlackjack } from "../src/SurvivalBlackjack";
import { describe, it, expect } from "vitest";
import { Deck, type Card, suitEnum } from "../src/Deck";

describe("blackjack scoring", () => {
  const game = new SurvivalBlackjack();
  it("scores number cards", () => {
    const hand = [
      { rank: 3, suit: suitEnum.clubs },
      { rank: 5, suit: suitEnum.hearts },
    ];
    expect(game.blackjackScoreHand(hand)).toBe(8);
  });
  it("scores face cards", () => {
    const hand = [
      // jack queen
      { rank: 11, suit: suitEnum.clubs },
      { rank: 12, suit: suitEnum.hearts },
    ];
    expect(game.blackjackScoreHand(hand)).toBe(20);
  });
  it("scores aces as 11 if score <= 10", () => {
    const hand = [
      // ace queen
      { rank: 1, suit: suitEnum.clubs },
      { rank: 12, suit: suitEnum.hearts },
    ];
    expect(game.blackjackScoreHand(hand)).toBe(21);
  });
  it("scores aces as 1 if score > 10", () => {
    const hand = [
      // ace queen 5
      { rank: 1, suit: suitEnum.clubs },
      { rank: 12, suit: suitEnum.hearts },
      { rank: 5, suit: suitEnum.hearts },
    ];
    expect(game.blackjackScoreHand(hand)).toBe(16);
  });
  it("returns scores > 21", () => {
    const hand = [
      // king queen 5
      { rank: 15, suit: suitEnum.clubs },
      { rank: 12, suit: suitEnum.hearts },
      { rank: 5, suit: suitEnum.hearts },
    ];
    expect(game.blackjackScoreHand(hand)).toBe(25);
  });
});

describe("take", () => {
  it("pulls n cards from deck", () => {
    const game = new SurvivalBlackjack();
    const cards = game.take(2);
    expect(cards).toHaveLength(2);
  });
  it("returns less than n if deck is exhausted", () => {
    const game = new SurvivalBlackjack();
    const cards1 = game.take(50);
    // deck is 54 cards, should be 4 left;
    const cards2 = game.take(6);
    expect(cards1).toHaveLength(50);
    expect(cards2).toHaveLength(4);
  });
  it("returns empty array if deck is exhausted", () => {
    const game = new SurvivalBlackjack();
    game.take(54);
    const cards = game.take(4);
    expect(cards).toHaveLength(0);
  });
});

describe("setup", () => {
  it("deals two cards to dealer and player", () => {
    const game = new SurvivalBlackjack();
    game.setup();
    expect(game.resources).toHaveLength(5);
  });
});
