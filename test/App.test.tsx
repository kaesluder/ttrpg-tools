// src/components/Button.test.tsx
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
];

vi.mock("../src/mosaicUtils", () => {
  const mockMosaicFetch = vi.fn(async (): Promise<string[]> => exampleData);
  return {
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
});
