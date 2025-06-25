function main() {
  const canvas = document.getElementById("canvas");
  const context = canvas.getContext("2d");
  const imageInput = document.getElementById("imageInput");
  const blackWhiteButton = document.getElementById("blacked");
  const pixelateButton = document.getElementById("pixelate");
  const pixelationInput = document.getElementById("pixelateSlider");
  const asciiButton = document.getElementById("ascii");
  const asciiCanvas = document.getElementById("ascii-container");
  const asciiContext = asciiCanvas.getContext("2d");
  let pixelationValue = 1;

  let defaultImageBitmap = null;

  let currentPixelateClickHandler = null;
  function createAsciiArt(pixelSize = 10) {
    return () => {
      console.log("creating ascii");
      if (!defaultImageBitmap) {
        console.error("No image loaded to convert into ascii.");
        return;
      }

      asciiContext.clearRect(0, 0, canvas.width, canvas.height);

      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      asciiContext.font = `${9}px monospace`;
      asciiContext.textBaseline = "top";

      for (let y = 0; y < canvas.height; y += pixelSize) {
        for (let x = 0; x < canvas.width; x += pixelSize) {
          const pixelIndex = y * canvas.width + x;
          const dataIndex = pixelIndex * 4;

          const r = data[dataIndex];
          const g = data[dataIndex + 1];
          const b = data[dataIndex + 2];
          const a = data[dataIndex + 3];

          const char = ".";

          asciiContext.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`;
          asciiContext.fillText(char, x, y);
        }
      }
    };
  }

  asciiButton.addEventListener("click", createAsciiArt());

  function createPixelateButtonHandler(pixelSize) {
    return () => {
      if (!defaultImageBitmap) {
        console.error("No image loaded to pixelate.");
        return;
      }

      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(defaultImageBitmap, 0, 0);

      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

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

      context.putImageData(imageData, 0, 0);
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

    pixelateButton.addEventListener("click", currentPixelateClickHandler);
  });

  imageInput.addEventListener("change", function (e) {
    const file = e.target.files[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();

    reader.onload = function (event) {
      const img = new Image();
      img.onload = function () {
        canvas.width = img.width;
        canvas.height = img.height;
        asciiCanvas.width = img.width;
        asciiCanvas.height = img.height;
        context.drawImage(img, 0, 0);

        createImageBitmap(img).then((bitmap) => {
          defaultImageBitmap = bitmap;
        });
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  });

  blackWhiteButton.addEventListener("click", () => {
    if (!defaultImageBitmap) {
      console.error("No image loaded to apply Black & White.");
      return;
    }

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(defaultImageBitmap, 0, 0);

    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      const average = (data[i] + data[i + 1] + data[i + 2]) / 3;
      data[i] = average;
      data[i + 1] = average;
      data[i + 2] = average;
    }
    context.putImageData(imageData, 0, 0);
  });
}

main();
