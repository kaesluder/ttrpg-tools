import { useState, useEffect, type JSX } from "react";
import "./App.css";
import {
  mosaicFetch,
  shuffleArray,
  type Tile,
  tilesFromFileList,
} from "./mosaicUtils";

function App() {
  const [imageList, setImageList] = useState<Tile[]>([]);

  useEffect(() => {
    mosaicFetch()
      .then((fileList: string[]) => {
        setImageList(shuffleArray(tilesFromFileList(fileList)));
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
    const tiles = [...imageList]; // copy
    tiles[index].selected = !tiles[index].selected; // toggle
    setImageList(tiles);
  };
  /**
   * Creates a renderable list of li elements from imageList
   * @returns {JSX.Element}
   */
  const renderList = (): JSX.Element => {
    const drawnTiles = imageList.slice(0, 9);
    const ilist = drawnTiles.map((tile, idx): JSX.Element => {
      return (
        <img
          className={
            tile.selected
              ? "h-48 w-48 object-cover img-tile border-4 border-solid border-indigo-500"
              : "h-48 w-48 object-cover img-tile border-none"
          }
          key={tile.url}
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
    </>
  );
}

export default App;
