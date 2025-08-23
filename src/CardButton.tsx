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
        return "\u2663";
      case "diamonds":
        return "\u2666";
      case "hearts":
        return "\u2665";
      case "spades":
        return "\u2660";
      default:
        // joker
        return "";
    }
  };

  const rankString = localizeRank(props.card.rank);
  const suitString = localizeSuit(props.card.suit);

  // TODO: format, suit formatting

  let cardTextColor = "";
  if (props.card.suit === "clubs" || props.card.suit === "spades") {
    cardTextColor = "text-gray-950";
  } else {
    cardTextColor = "text-red-800";
  }

  return (
    <button
      className={`bg-yellow-50 ${cardTextColor} text-2xl m-3 w-24 h-24 p-1 rounded-md`}
      onClick={handleClick}
    >
      <div className="text-2xl">{rankString}</div>
      <div className="text-5xl">{suitString}</div>
    </button>
  );
}
