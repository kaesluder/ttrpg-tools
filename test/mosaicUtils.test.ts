import { render, screen, waitFor } from "@testing-library/react";
import { vi, describe, it, expect, Mock, beforeEach, afterEach } from "vitest";
import { drawGenerator } from "../src/mosaicUtils";

describe("drawGenerator", () => {
  it("loops over the deck repeating cards", () => {
    const deck = drawGenerator([1, 2, 3]);
    const drawSix = Array.from({ length: 6 }, () => deck.next().value);
    expect(drawSix.filter((n) => n === 1).length).toBe(2);
    expect(drawSix.filter((n) => n === 2).length).toBe(2);
    expect(drawSix.filter((n) => n === 3).length).toBe(2);
  });
  it("does not exhaust when more pulls than length of list", () => {
    const deck = drawGenerator([1, 2, 3]);
    const drawFour = Array.from({ length: 4 }, () => deck.next().value);
    expect(drawFour.length).toBe(4);
    expect(drawFour[3]).toBeTypeOf("number");
  });
  it("pulls 10 values without exhausting or returning undefined", () => {
    const deck = drawGenerator(["A", "B", "C"]);
    const draws = Array.from({ length: 10 }, () => deck.next().value);

    expect(draws.length).toBe(10);
    draws.forEach((value) => {
      expect(value).toBeDefined();
      expect(["A", "B", "C"]).toContain(value);
    });
  });
  it("throws error when given empty array", () => {
    expect(() => {
      const gen = drawGenerator([]);
      gen.next();
    }).toThrow("drawGenerator requires a non-empty array");
  });
});
