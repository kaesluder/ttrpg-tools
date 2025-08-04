import { render, screen, waitFor } from "@testing-library/react";
import App from "../src/App";
import { vi, describe, it, expect, Mock, beforeEach, afterEach } from "vitest";
import { mosaicFetch } from "../src/mosaicUtils";

const exampleData = [
  "15th_century_egyptian_anatomy_of_horse.jpg",
  "15th_century_egyptian_anatomy_of_horse_head.jpg",
  "15th_century_egyptian_anatomy_of_horse_lower.jpg",
  "15th_century_egyptian_anatomy_of_horse_upper.jpg",
  "163_of_'Five_Years_in_Siam_from_1891_to_1896_..._With_maps_and_illustrations_by_the_author'_(11249062174).jpg",
  "640px-Avon_Fantasy_Reader_8.jpg",
  "640px-Avon_Fantasy_Reader_8_1.jpg",
  "640px-Avon_Fantasy_Reader_8_2.jpg",
  "640px-Avon_Fantasy_Reader_8_3.jpg",
  "640px-Avon_Fantasy_Reader_8_4.jpg",
];

vi.mock("../src/mosaicUtils", async () => {
  const mockMosaicFetch = vi.fn(async (): Promise<string[]> => exampleData);
  const originalModule = await vi.importActual("../src/mosaicUtils");
  return {
    ...originalModule,
    mosaicFetch: mockMosaicFetch,
  };
});

describe("App", async () => {
  it("Renders 9 images", async () => {
    const { container } = render(<App />);

    await waitFor(() => {
      const imageList = container.querySelectorAll("img.img-tile");
      expect(imageList).toHaveLength(9);
      expect(mosaicFetch).toHaveBeenCalled();
      (mosaicFetch as Mock).mockClear();
    });
  });

  it("Applies border styling when a tile is clicked", async () => {
    const { container } = render(<App />);

    // Wait for images to render
    await waitFor(() => {
      const imageList = container.querySelectorAll("img.img-tile");
      expect(imageList).toHaveLength(9);
    });

    // Get the first tile
    const firstTile = container.querySelector(
      "img.img-tile",
    ) as HTMLImageElement;
    expect(firstTile).toBeTruthy();

    // Initially, tile should not have border (unselected state)
    expect(firstTile.className).toContain("border-none");
    expect(firstTile.className).not.toContain("border-indigo-500");

    // Click the tile
    firstTile.click();

    // After click, tile should have border styling (selected state)
    await waitFor(() => {
      expect(firstTile.className).toContain("border-4");
      expect(firstTile.className).toContain("border-solid");
      expect(firstTile.className).toContain("border-indigo-500");
      expect(firstTile.className).not.toContain("border-none");
    });

    // Click again to toggle back
    firstTile.click();

    // Should return to unselected state
    await waitFor(() => {
      expect(firstTile.className).toContain("border-none");
      expect(firstTile.className).not.toContain("border-indigo-500");
    });
  });

  it("Multiple tiles can be selected independently", async () => {
    const { container } = render(<App />);

    // Wait for images to render
    await waitFor(() => {
      const imageList = container.querySelectorAll("img.img-tile");
      expect(imageList).toHaveLength(9);
    });

    const tiles = container.querySelectorAll(
      "img.img-tile",
    ) as NodeListOf<HTMLImageElement>;
    const firstTile = tiles[0];
    const secondTile = tiles[1];

    // Click first tile
    firstTile.click();

    await waitFor(() => {
      expect(firstTile.className).toContain("border-indigo-500");
      expect(secondTile.className).toContain("border-none");
    });

    // Click second tile
    secondTile.click();

    await waitFor(() => {
      // Both tiles should now be selected
      expect(firstTile.className).toContain("border-indigo-500");
      expect(secondTile.className).toContain("border-indigo-500");
    });

    // Click first tile again (deselect)
    firstTile.click();

    await waitFor(() => {
      // First tile should be deselected, second should remain selected
      expect(firstTile.className).toContain("border-none");
      expect(secondTile.className).toContain("border-indigo-500");
    });
  });
});
