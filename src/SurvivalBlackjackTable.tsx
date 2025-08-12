import { useState, useEffect, useRef, type JSX } from "react";
import "./App.css";
import CardButton from "./CardButton";
import { suitEnum, type Card, Deck } from "./Deck";
import { SurvivalBlackjack } from "./SurvivalBlackjack";

export default function SurvivalBlackjackTable() {
  const game = useRef<SurvivalBlackjack | null>(new SurvivalBlackjack());

  game.current?.setup();
  game.current?.startTurn();

  const [resources, setResources] = useState(game.current?.resources);
  const [playerHand, setPlayerHand] = useState(game.current?.playerHand);
  const [dealerHand, setDealerHand] = useState(game.current?.dealerHand);
  const [playerScore, setPlayerScore] = useState(game.current?.playerScore);
  const [dealerScore, setDealerScore] = useState(game.current?.dealerScore);

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

  return (
    <main className="flex flex-row">
      <section id="resources">
        <h2>Resources</h2>
        <div className="flex flex-col">
          {buildCardList(resources!, "resources", () => {})}
        </div>
      </section>
      <section id="player">
        <h2>Player</h2>
        <div className="flex flex-col">
          {buildCardList(playerHand!, "playerHand", () => {})}
        </div>
        <div>Total Score: {playerScore}</div>
      </section>
      <section id="dealer">
        <h2>Dealer</h2>
        <div className="flex flex-col">
          {buildCardList(dealerHand!, "dealerHand", () => {})}
        </div>
        <div>Total Score: {dealerScore}</div>
      </section>
    </main>
  );
}
