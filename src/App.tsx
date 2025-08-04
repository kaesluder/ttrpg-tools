import { useState, useEffect, useRef, type JSX } from "react";
import "./App.css";
import {
  mosaicFetch,
  shuffleArray,
  type Tile,
  tilesFromFileList,
  drawGenerator,
} from "./mosaicUtils";

function App() {
  // full list of tiles
  const [imageList, setImageList] = useState<Tile[]>([]);

  // List of tiles displayed on page.
  const [displayTiles, setDisplayTiles] = useState<Tile[]>([]);

  // Generator object. Contains internal generator state and list of
  // all tiles.
  const cardGen = useRef<Generator<Tile> | undefined>(undefined);

  useEffect(() => {
    mosaicFetch()
      .then((fileList: string[]) => {
        const tileList = tilesFromFileList(fileList);
        setImageList(tileList);
        cardGen.current = drawGenerator(tileList);
        setDisplayTiles(
          Array.from({ length: 9 }, () => cardGen.current!.next().value),
        );
      })
      .catch((error) => console.error("failed to fetch image list:", error));
  }, []);

  /**
   * Handles ui logic after a user clicks a tile.
   * - Toggles selected property for tile.
   *
   * @param {React.MouseEvent<HTMLImageElement>} e Image tile.
   * @modifies imageList
   *
   */
  const handleTileClick = (e: React.MouseEvent<HTMLImageElement>) => {
    const id = e.currentTarget.id;
    const index = parseInt(id.replace("image-tile", ""));
    const tiles = [...displayTiles]; // copy
    tiles[index].selected = !tiles[index].selected; // toggle
    setDisplayTiles(tiles);
  };

  /**
   * Handles redrawing from the deck of tiles when button is
   * clicked. Avoids dupliating or replacing selected tiles.
   * @modifies displayTiles (state): list of tiles displayed on web page
   * @modifies cardGen (ref): generator object to simulate repeated draws from shuffled tiles
   */
  const handleDrawCards = () => {
    console.log("=================");
    console.log("displayTiles.length", displayTiles.length);
    const selectedTiles = displayTiles.filter((tile) => tile.selected);
    const result = displayTiles.map((tile: Tile) => {
      if (tile.selected) {
        return tile;
      } else {
        let newTile = cardGen.current!.next().value;

        // ensure that selected cards are not duplicated
        while (selectedTiles.map((tile) => tile.url).includes(newTile.url)) {
          newTile = cardGen.current!.next().value;
        }
        // tiles will repeat after many redraws.
        // Ensure that selection state for drawn tiles is false
        // to prevent having multiple copies selected.
        return { ...newTile, selected: false };
      }
    });
    setDisplayTiles(result);
  };

  /**
   * Creates a renderable list of li elements from imageList
   * @returns {JSX.Element}
   */
  const renderList = (): JSX.Element => {
    const ilist = displayTiles.map((tile, idx): JSX.Element => {
      return (
        <img
          className={
            tile.selected
              ? "h-48 w-48 object-cover img-tile border-4 border-solid border-indigo-500"
              : "h-48 w-48 object-cover img-tile border-none"
          }
          key={`image-tile${idx}`}
          id={`image-tile${idx}`}
          src={"./mosaic/" + tile.url}
          onClick={(e: React.MouseEvent<HTMLImageElement>) => {
            handleTileClick(e);
          }}
        />
      );
    });
    return <>{ilist}</>;
  };

  return (
    <>
      <div className="grid grid-cols-3 bg-white">{renderList()}</div>
      <div>
        <button id="refresh_button" onClick={handleDrawCards}>
          Draw New Tiles
        </button>
      </div>
    </>
  );
}

export default App;
