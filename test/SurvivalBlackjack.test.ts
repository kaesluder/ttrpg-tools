import * as sb from "../src/SurvivalBlackjack";
import { describe, it, expect, vi } from "vitest";
import { Deck, type Card, suitEnum } from "../src/Deck";

describe("Survival Blackjack: take", () => {
  it("returns an array of n cards", () => {
    const deck = new Deck();
    const drawPile = deck.shuffledDeck.values();
    const takeTwo = sb.take(drawPile, 2);
    expect(takeTwo).toHaveLength(2);
    const takeEight = sb.take(drawPile, 8);
    expect(takeEight).toHaveLength(8);
  });
});

describe("Survival Blackjack: setup", () => {
  it("adds 5 cards (default resourceCount) to the resources array", () => {
    const deck = new Deck();
    const drawPile = deck.shuffledDeck.values();
    const game = new sb.SurvivalBlackjack();
    expect(game.resources).toHaveLength(0);
    const gameAfterSetup = sb.setup(game, drawPile);
    expect(gameAfterSetup.resources).toHaveLength(5);

    // test that game has been copied
    expect(game.resources).toHaveLength(0);
  });
  it("adds 8 cards (custom resourceCount) to the resources array", () => {
    const deck = new Deck();
    const resourceCount = 8;
    const drawPile = deck.shuffledDeck.values();
    const game = new sb.SurvivalBlackjack();
    expect(game.resources).toHaveLength(0);
    const gameAfterSetup = sb.setup(game, drawPile, resourceCount);
    expect(gameAfterSetup.resources).toHaveLength(8);
  });
});

const ace: Card = { suit: suitEnum.clubs, rank: 1 };
const numberCard: Card = { suit: suitEnum.spades, rank: 5 };
const faceCard: Card = { suit: suitEnum.diamonds, rank: 12 };

describe("SurvivalBlackjack: blackjackScoreCard", () => {
  it("returns representative values for ace, number, and face cards", () => {
    expect(sb.blackjackScoreCard(ace)).toBe(1);
    expect(sb.blackjackScoreCard(numberCard)).toBe(5);
    expect(sb.blackjackScoreCard(faceCard)).toBe(10);
  });
});

describe("SurvivalBlackjack: blackjackScoreHand", () => {
  it("returns 21 for [ace, face] ace = 11", () => {
    const hand = [ace, faceCard];
    expect(sb.blackjackScoreHand(hand)).toBe(21);
  });
  it("returns 16 for [ace, face, number] ace = 1", () => {
    const hand = [ace, faceCard, numberCard];
    expect(sb.blackjackScoreHand(hand)).toBe(16);
  });
  it("returns 16 for [ace, number] ace = 11", () => {
    const hand = [ace, numberCard];
    expect(sb.blackjackScoreHand(hand)).toBe(16);
  });
  it("returns 30 for [face, face, face]", () => {
    const hand = [faceCard, faceCard, faceCard];
    expect(sb.blackjackScoreHand(hand)).toBe(30);
  });
});

describe("Survival Blackjack: startTurn", () => {
  it("adds 2 cards to player and dealer hands", () => {
    const deck = new Deck();
    const drawPile = deck.shuffledDeck.values();
    const game = new sb.SurvivalBlackjack();
    expect(game.playerHand).toHaveLength(0);
    expect(game.dealerHand).toHaveLength(0);
    const gameAfterTurnStart = sb.startTurn(game, drawPile);
    expect(gameAfterTurnStart.playerHand).toHaveLength(2);
    expect(gameAfterTurnStart.dealerHand).toHaveLength(2);
  });
});
