import * as sb from "../src/SurvivalBlackjack";
import { describe, it, expect, vi } from "vitest";
import { Deck, type Card } from "../src/Deck";

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

describe("Survival Blackjack: setStage", () => {
  it("sets the stage property", () => {
    const game = new sb.SurvivalBlackjack();
    const gameAfterSetStage = game.setStage(sb.turnStage.endgame);
    expect(gameAfterSetStage.stage).toBe(sb.turnStage.endgame);
  });
});

describe("Survival Blackjack: setup", () => {
  it("adds 5 cards (default resourceCount) to the resources array", () => {
    const deck = new Deck();
    const drawPile = deck.shuffledDeck.values();
    const game = new sb.SurvivalBlackjack();
    expect(game.resources).toHaveLength(0);
    const gameAfterSetup = game.setup(drawPile);
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
    const gameAfterSetup = game.setup(drawPile, resourceCount);
    expect(gameAfterSetup.resources).toHaveLength(8);
  });
});

const ace: Card = { suit: "clubs", rank: 1 };
const numberCard: Card = { suit: "spades", rank: 5 };
const faceCard: Card = { suit: "diamonds", rank: 12 };

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
    const gameAfterTurnStart = game.startTurn(drawPile);
    expect(gameAfterTurnStart.playerHand).toHaveLength(2);
    expect(gameAfterTurnStart.dealerHand).toHaveLength(2);
  });
});

describe("reducer functions", () => {
  let deck: Deck;
  let drawPile: ArrayIterator<Card>;
  let game: sb.SurvivalBlackjack;
  beforeEach(() => {
    deck = new Deck();
    drawPile = deck.sortedDeck.values();
    game = new sb.SurvivalBlackjack();
  });
  it("sets up resources in start game stage", () => {
    const reducer = sb.makeReducer(drawPile);
    const result = reducer(game, { type: sb.turnStage.start });
    expect(result.resources.length).toBe(5);
    const expected = [
      { rank: 1, suit: "clubs" },
      { rank: 2, suit: "clubs" },
      { rank: 3, suit: "clubs" },
      { rank: 4, suit: "clubs" },
      { rank: 5, suit: "clubs" },
    ];
    expect(result.resources).toStrictEqual(expected);
  });
  it("draws cards in start turn phase", () => {
    const reducer = sb.makeReducer(drawPile);
    let result = reducer(game, { type: sb.turnStage.start });
    result = reducer(result, { type: sb.turnStage.playerTurn });

    // resources should be unchanged
    expect(result.resources.length).toBe(5);
    const expected = [
      { rank: 1, suit: "clubs" },
      { rank: 2, suit: "clubs" },
      { rank: 3, suit: "clubs" },
      { rank: 4, suit: "clubs" },
      { rank: 5, suit: "clubs" },
    ];

    // player and dealer hands
    const expectedPlayerHand = [
      { rank: 6, suit: "clubs" },
      { rank: 7, suit: "clubs" },
    ];
    const expectedDealerHand = [
      { rank: 8, suit: "clubs" },
      { rank: 9, suit: "clubs" },
    ];

    expect(result.resources).toStrictEqual(expected);
    expect(result.playerHand).toStrictEqual(expectedPlayerHand);
    expect(result.dealerHand).toStrictEqual(expectedDealerHand);
    console.log(result);
  });
  it("adds a card to playerHand on hit", () => {
    const reducer = sb.makeReducer(drawPile);
    let result = reducer(game, { type: sb.turnStage.start });
    result = reducer(result, { type: sb.turnStage.playerTurn });

    // playerHand should have two cards before hit
    expect(result.playerHand.length).toBe(2);

    // hit (draw a card)
    result = reducer(result, { type: sb.turnStage.hit, drawPile: drawPile });
    expect(result.playerHand.length).toBe(3);

    // reset back to playerTurn
    expect(result.stage).toBe(sb.turnStage.playerTurn);
  });
  it("jumps to endgame if hit and deck is exhausted", () => {
    const reducer = sb.makeReducer(drawPile);
    let result = reducer(game, { type: sb.turnStage.start });
    result = reducer(result, { type: sb.turnStage.playerTurn });

    // playerHand should have two cards before hit
    expect(result.playerHand.length).toBe(2);

    // hit (draw a card)
    const exhaustedDeck: ArrayIterator<Card> = [].values();
    result = reducer(result, {
      type: sb.turnStage.hit,
      drawPile: exhaustedDeck,
    });
    expect(result.playerHand.length).toBe(2);

    // jump to endgame
    expect(result.stage).toBe(sb.turnStage.endgame);
  });
});
