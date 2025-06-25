const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const inputDir = "./public/mosaic";
const outputDir = "./public/mosaic/slices";
const tileWidth = 100;
const tileHeight = 100;

fs.mkdirSync(outputDir, { recursive: true });

fs.readdirSync(inputDir).forEach(async (file) => {
  if (!/\.(jpg|jpeg|png)$/i.test(file)) return;

  const inputPath = path.join(inputDir, file);
  const image = sharp(inputPath);
  const metadata = await image.metadata();

  const cols = Math.ceil(metadata.width / tileWidth);
  const rows = Math.ceil(metadata.height / tileHeight);
  const basename = path.parse(file).name;

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const left = x * tileWidth;
      const top = y * tileHeight;
      const width = Math.min(tileWidth, metadata.width - left);
      const height = Math.min(tileHeight, metadata.height - top);

      const outputPath = path.join(
        outputDir,
        `${basename}_${x}_${y}.png`
      );

      await image
        .extract({ left, top, width, height })
        .toFile(outputPath);
    }
  }
});



