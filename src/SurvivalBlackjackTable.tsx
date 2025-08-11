import { useState, useEffect, useRef, type JSX } from "react";
import "./App.css";
import CardButton from "./CardButton";
import { suitEnum, type Card, Deck } from "./Deck";
import { SurvivalBlackjack } from "./SurvivalBlackjack";

export default function SurvivalBlackjackTable() {
  const game = useRef<SurvivalBlackjack | null>(new SurvivalBlackjack());

  game.current?.setup();

  const [resources, setResources] = useState(game.current?.resources);

  function buildCardList(cards: Card[]) {
    return cards.map((card, index) => {
      const key = `${card.rank}:${card.suit}:${index}`;
      return <CardButton card={card} key={key}></CardButton>;
    });
  }

  return (
    <main>
      <section id="resources">
        <h2>Resources</h2>
        <div className="flex flex-col">{buildCardList(resources!)}</div>
      </section>
    </main>
  );
}
