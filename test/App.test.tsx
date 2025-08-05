import { render, waitFor, act } from "@testing-library/react";
import App from "../src/App";
import { vi, describe, it, expect, Mock } from "vitest";
import { mosaicFetch } from "../src/mosaicUtils";

const exampleData = [
  "1.jpg",
  "2.jpg",
  "3.jpg",
  "4.jpg",
  "5.jpg",
  "6.jpg",
  "7.jpg",
  "8.jpg",
  "9.jpg",
  "10.jpg",
  "11.jpg",
  "12.jpg",
  "13.jpg",
  "14.jpg",
  "15.jpg",
  "16.jpg",
  "17.jpg",
  "18.jpg",
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

describe("App redraw", () => {
  it("replaces all tiles when none are selected", async () => {
    const { container } = render(<App />);
    const urlList: string[] = [];

    await waitFor(() => {
      const imageList = container.querySelectorAll("img.img-tile");
      for (const image of imageList) {
        urlList.push(image.getAttribute("src")!);
      }
      console.log("urlList", urlList);
      expect(urlList.length).toBe(9);
    });
    act(() => {
      const reloadButton = container.querySelector(
        "button#refresh_button",
      ) as HTMLButtonElement;
      if (reloadButton) {
        reloadButton.click();
      }
    });

    await waitFor(() => {
      const imageList2 = container.querySelectorAll("img.img-tile");
      const urlSet = new Set(urlList);
      for (const image of imageList2) {
        expect(!urlSet.has(image.getAttribute("src")!));
      }
    });
  });
  it("holds back tiles after replacement", async () => {
    const { container } = render(<App />);
    let imageList: NodeListOf<HTMLImageElement>;
    let firstURL: string;
    let urlList: string[] = [];

    await waitFor(() => {
      imageList = container.querySelectorAll("img.img-tile");
      firstURL = imageList[0].getAttribute("src")!;
      expect(firstURL).toBeTruthy();
      urlList = Array.from(imageList)
        .map((image) => image.getAttribute("src")!)
        .slice(1);
    });

    const urlSet = new Set(urlList);

    act(() => {
      const reloadButton = container.querySelector(
        "button#refresh_button",
      ) as HTMLButtonElement;
      if (imageList[0]) {
        imageList[0].click();
      }
      if (reloadButton) {
        reloadButton.click();
      }
    });

    await waitFor(() => {
      const imageList2 = container.querySelectorAll("img.img-tile");
      for (let i = 1; i < 9; i++) {
        expect(!urlSet.has(imageList2[i].getAttribute("src")!));
      }
      const firstImage = container.querySelector("img.img-tile")!;
      expect(firstImage.getAttribute("src")!).toBe(firstURL);
    });
  });
});
