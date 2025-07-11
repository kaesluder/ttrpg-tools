export const mosaicFetch = async (): Promise<string[]> => {
  const res = await fetch("/mosaic/index.json");
  const imageList: string[] = await res.json();
  return imageList;
};
