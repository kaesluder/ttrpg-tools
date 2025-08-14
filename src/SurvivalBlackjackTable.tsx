import { useReducer, useState, useEffect, useRef, type JSX } from "react";
import "./App.css";
import CardButton from "./CardButton";
import { suitEnum, type Card, Deck } from "./Deck";
import * as sb from "./SurvivalBlackjack";
import { produce } from "immer";

const deck = new Deck();
const drawPile: ArrayIterator<Card> = deck.shuffledDeck.values();

function reducer(state: sb.SurvivalBlackjack, action: any) {
  console.log("reducer");
  switch (action.type) {
    case sb.turnStage.start:
      return produce(state, (state) => {
        state.stage = sb.turnStage.start;
        return state;
      });
    case sb.turnStage.playerTurn:
      return produce(state, (state) => {
        state = sb.startTurn(state, drawPile);
        state = sb.setup(state, drawPile);
        state.stage = sb.turnStage.playerTurn;
        return state;
      });
    case sb.turnStage.dealerTurn:
      return produce(state, (state) => {
        state = sb.startTurn(state, drawPile);
        state.stage = sb.turnStage.dealerTurn;
        return state;
      });
    default:
      return state;
  }
}

export default function SurvivalBlackjackTable() {
  const initialGame = new sb.SurvivalBlackjack();
  const [game, dispatch] = useReducer(reducer, initialGame);

  useEffect(() => {
    dispatch({
      type: sb.turnStage.start,
    });
  }, []);

  function stageNav() {
    if (game.stage === sb.turnStage.start) {
      return (
        <nav>
          <button onClick={() => dispatch({ type: sb.turnStage.playerTurn })}>
            Start Game
          </button>
        </nav>
      );
    } else if (game.stage === sb.turnStage.playerTurn) {
      return (
        <nav>
          <button>Hit</button>
          <button onClick={() => dispatch({ type: sb.turnStage.dealerTurn })}>
            Stand
          </button>
        </nav>
      );
    } else if (game.stage === sb.turnStage.dealerTurn) {
      return (
        <nav>
          <label>Dealer's Turn</label>
          <button>Score Round</button>
        </nav>
      );
    }
  }

  function buildCardList(
    cards: Card[],
    prefixKey: string,
    clickHandler: () => void,
  ) {
    return cards.map((card, index) => {
      const key = `${prefixKey}:${card.rank}:${card.suit}:${index}`;
      return (
        <CardButton
          card={card}
          key={key}
          clickHandler={clickHandler}
        ></CardButton>
      );
    });
  }

  function startStageHidden() {
    if (game.stage === sb.turnStage.start) {
      return "invisible";
    } else {
      return "visible";
    }
  }

  function instructions() {
    if (game.stage === sb.turnStage.start) {
      return (
        <section className="flex justify-center-safe">
          <div className="text-left space-y-4 w-1/3">
            <p>
              Survival Blackjack plays like blackjack, but with some quirks.
              It's meant to be used as an alternate oracle for survival rpgs in
              the flavor of <em>Wretched and Alone</em>,{" "}
              <em>Lost Among the Starlit Wreckage,</em> or{" "}
              <em>The Cog that Remains</em>.
            </p>
            <p>
              Each round you win puts you a step closer to survival. Each round
              you lose is a step back. A losing streak can be fatal.
            </p>
            <p>
              You have {game.resourceCount} resource cards you can play. Choose
              wisely, they can't be replaced.
            </p>
            <p>
              When you've played through the entire deck, total up your score
              and face the consequences.
            </p>
          </div>
        </section>
      );
    } else {
      return "";
    }
  }

  return (
    <div>
      {instructions()}
      <main className={`flex flex-row ${startStageHidden()}`}>
        <section id="resources">
          <h2>Resources</h2>
          <div className="flex flex-col">
            {buildCardList(game.resources, "resources", () => {})}
          </div>
        </section>
        <section id="player">
          <h2>Player</h2>
          <div className="flex flex-col">
            {buildCardList(game.playerHand, "playerHand", () => {})}
          </div>
          <div>This Round: {sb.blackjackScoreHand(game.playerHand)}</div>
          <div>Total Score: {game.playerScore}</div>
        </section>
        <section id="dealer">
          <h2>Dealer</h2>
          <div className="flex flex-col">
            {buildCardList(game.dealerHand, "dealerHand", () => {})}
          </div>
          <div>This Round: {sb.blackjackScoreHand(game.dealerHand)}</div>
          <div>Total Score: {game.dealerScore}</div>
        </section>
      </main>
      {stageNav()}
    </div>
  );
}
