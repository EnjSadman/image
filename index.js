function main() {
  const canvas = document.getElementById("canvas");
  const context = canvas.getContext("2d");
  const imageInput = document.getElementById("imageInput");
  const blackWhiteButton = document.getElementById("blacked");
  const pixelateButton = document.getElementById("pixelate");
  const pixelationInput = document.getElementById("pixelateSlider");
  let pixelationValue = 1;

  let currentPixelateClickHandler = null;

  function createPixelateButtonHandler(pixelSize) {
    return () => {
      if (!imageInput.files[0]) {
        console.error("No image selected to pixelate.");
        return;
      }

      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      console.log("Pixelating with size:", pixelSize);

      for (let y = 0; y < canvas.height; y += pixelSize) {
        for (let x = 0; x < canvas.width; x += pixelSize) {
          let r = 0,
            g = 0,
            b = 0,
            a = 0;
          let count = 0;

          for (let dy = 0; dy < pixelSize; dy++) {
            for (let dx = 0; dx < pixelSize; dx++) {
              const currentX = x + dx;
              const currentY = y + dy;

              if (currentX < canvas.width && currentY < canvas.height) {
                const index = (currentY * canvas.width + currentX) * 4;
                r += data[index];
                g += data[index + 1];
                b += data[index + 2];
                a += data[index + 3];
                count++;
              }
            }
          }

          // Apply the calculated average color to all pixels within this block
          if (count > 0) {
            r = Math.floor(r / count);
            g = Math.floor(g / count);
            b = Math.floor(b / count);
            a = Math.floor(a / count);
          }
          for (let dy = 0; dy < pixelSize; dy++) {
            for (let dx = 0; dx < pixelSize; dx++) {
              const currentX = x + dx;
              const currentY = y + dy;

              if (currentX < canvas.width && currentY < canvas.height) {
                const index = (currentY * canvas.width + currentX) * 4;
                data[index] = r;
                data[index + 1] = g;
                data[index + 2] = b;
                data[index + 3] = a;
              }
            }
          }
        }
      }

      // Put the modified image data back onto the canvas
      context.putImageData(imageData, 0, 0);
      console.log("Image pixelated and redrawn.");
    };
  }

  currentPixelateClickHandler = createPixelateButtonHandler(pixelationValue);
  pixelateButton.addEventListener("click", currentPixelateClickHandler);

  pixelationInput.addEventListener("change", (event) => {
    pixelationValue = parseInt(event.target.value);

    if (currentPixelateClickHandler) {
      pixelateButton.removeEventListener("click", currentPixelateClickHandler);
    }

    currentPixelateClickHandler = createPixelateButtonHandler(pixelationValue);

    console.log(
      "Pixelation value updated to:",
      pixelationValue,
      "New pixelate button listener attached."
    );
    pixelateButton.addEventListener("click", currentPixelateClickHandler);
  });

  imageInput.addEventListener("change", function (e) {
    const file = e.target.files[0];
    if (!file) {
      console.error("No file selected.");
      return;
    }
    const reader = new FileReader();

    reader.onload = function (event) {
      const img = new Image();
      img.onload = function () {
        canvas.width = img.width;
        canvas.height = img.height;
        context.drawImage(img, 0, 0);
        console.log("Image loaded and drawn to canvas.");
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  });

  blackWhiteButton.addEventListener("click", () => {
    if (!imageInput.files[0]) {
      console.error("No image selected to apply Black & White.");
      return;
    }

    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      const average = (data[i] + data[i + 1] + data[i + 2]) / 3;
      data[i] = average;
      data[i + 1] = average;
      data[i + 2] = average;
    }
    context.putImageData(imageData, 0, 0);

    console.log("Image data modified and redrawn (Black & White).");
  });
}

main();
