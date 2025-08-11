import { useState, useEffect, useRef, type JSX } from "react";
import { type Card } from "./Deck";

interface CardButtonProps {
  card: Card;
  clickHandler?: (card: Card) => void;
}

export default function CardButton(props: CardButtonProps) {
  const handleClick = () => {
    if (props.clickHandler) {
      props.clickHandler(props.card);
    }
  };

  const localizeRank = (rank: number) => {
    switch (rank) {
      case 0:
        return "Joker";
      case 1:
        return "Ace";
      case 11:
        return "Jack";
      case 12:
        return "Queen";
      case 13:
        return "King";
      default:
        return rank.toString();
    }
  };

  const rankString = localizeRank(props.card.rank);

  return (
    <button onClick={handleClick}>
      {rankString} {props.card.suit.toString()}
    </button>
  );
}
