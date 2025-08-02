export type Tile = {
  url: string;
  selected: boolean;
};

/**
 * @fileoverview Utility functions for mosaic image management and array operations.
 * Provides functionality to fetch mosaic images from the server and shuffle arrays.
 */

/**
 * Fetches the list of available mosaic images from the server.
 *
 * @async
 * @function mosaicFetch
 * @returns {Promise<string[]>} A promise that resolves to an array of image filenames
 * @throws {Error} Throws an error if the fetch request fails or if the response is not valid JSON
 * @example
 * const imageList = await mosaicFetch();
 * console.log(`Found ${imageList.length} images`);
 */
export const mosaicFetch = async (): Promise<string[]> => {
  const res = await fetch("./mosaic/index.json");
  const imageList: string[] = await res.json();
  return imageList;
};

/**
 * Shuffles an array in place using the Fisher-Yates shuffle algorithm.
 * This function modifies the original array and returns it.
 *
 * @template T - The type of elements in the array
 * @function shuffleArray
 * @param {T[]} array - The array to shuffle (can be any type)
 * @returns {T[]} The same array instance, now shuffled
 * @example
 * const images = ['image1.jpg', 'image2.jpg', 'image3.jpg'];
 * const shuffled = shuffleArray(images);
 * // Both 'images' and 'shuffled' reference the same shuffled array
 */
export function shuffleArray<T>(array: T[]): T[] {
  let currentIndex = array.length;
  let randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex !== 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}

/**
 * Transforms a list of file URLs into Tile objects.
 * Each file URL is converted to a Tile with the URL and default selected state.
 *
 * @function tilesFromFileList
 * @param {string[]} fileList - Array of file URLs to convert to tiles
 * @returns {Tile[]} Array of Tile objects with URLs and default selected state (false)
 * @example
 * const urls = ['image1.jpg', 'image2.jpg', 'image3.jpg'];
 * const tiles = tilesFromFileList(urls);
 * // Returns: [{ url: 'image1.jpg', selected: false }, ...]
 */
export function tilesFromFileList(fileList: string[]): Tile[] {
  return fileList.map((url) => ({
    url,
    selected: false,
  }));
}
