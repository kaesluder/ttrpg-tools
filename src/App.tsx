import { useState, useEffect, type JSX } from "react";
import "./App.css";
import { mosaicFetch } from "./mosaicUtils";

function shuffleArray(array: string[]) {
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

function App() {
  const [imageList, setImageList] = useState<string[]>([]);

  useEffect(() => {
    mosaicFetch()
      .then(setImageList)
      .catch((error) => console.error("failed to fetch image list:", error));
  }, []);

  const renderList = (): JSX.Element => {
    const shuffled = shuffleArray(imageList).slice(0, 9);
    const ilist = shuffled.map((fileName, idx): JSX.Element => {
      return (
        <img
          className="h-48 w-48 object-cover img-tile"
          key={fileName}
          id={`image-tile${idx}`}
          src={"/mosaic/" + fileName}
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
