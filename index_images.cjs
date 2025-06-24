const fs = require("fs");
const path = require("path");

const imageDir = path.join(__dirname, "public/mosaic");
const outputFile = path.join(imageDir, "index.json");

const validExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"];

fs.readdir(imageDir, (err, files) => {
  if (err) {
    console.error("Error reading image directory:", err);
    return;
  }

  const images = files.filter((file) =>
    validExtensions.includes(path.extname(file).toLowerCase()),
  );

  fs.writeFile(outputFile, JSON.stringify(images, null, 2), (err) => {
    if (err) {
      console.error("Error writing index.json:", err);
    } else {
      console.log(`Wrote ${images.length} images to ${outputFile}`);
    }
  });
});
