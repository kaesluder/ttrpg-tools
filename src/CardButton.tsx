import { useState, useEffect, useRef, type JSX } from "react";
import { type Card, type Suit } from "./Deck";

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

  /** transform special card ranks to localized string */
  const localizeRank = (rank: number): string => {
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

  /** Transform suits to localized string */
  const localizeSuit = (suit: Suit): string => {
    switch (suit) {
      case "clubs":
        return "Clubs";
      case "diamonds":
        return "Diamonds";
      case "hearts":
        return "Hearts";
      case "spades":
        return "Spades";
      default:
        // joker
        return "";
    }
  };

  const rankString = localizeRank(props.card.rank);
  const suitString = localizeSuit(props.card.suit);

  // TODO: format, suit formatting

  return (
    <button onClick={handleClick}>
      {rankString} {suitString}
    </button>
  );
}
