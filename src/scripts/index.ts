import { AsciiConverter } from "./ascii.js";
import { Pixelator } from "./pixelation.js";

function main(): void {
  console.log("main called");
  const canvas = document.getElementById("canvas") as HTMLCanvasElement;
  const context = canvas.getContext("2d");

  if (!context) {
    console.error("Failed to get 2D context for main canvas.");
    return;
  }

  const imageInput = document.getElementById("imageInput") as HTMLInputElement;
  const blackWhiteButton = document.getElementById(
    "blacked"
  ) as HTMLButtonElement;
  const pixelateButton = document.getElementById(
    "pixelate"
  ) as HTMLButtonElement;
  const pixelationInput = document.getElementById(
    "pixelateSlider"
  ) as HTMLInputElement;
  const pixelationValueDisplay = document.getElementById(
    "pixelationValueDisplay"
  ) as HTMLSpanElement;

  const asciiButton = document.getElementById("ascii") as HTMLButtonElement;
  const asciiCanvas = document.getElementById(
    "ascii-container"
  ) as HTMLCanvasElement;
  const asciiContext = asciiCanvas.getContext("2d");

  if (!asciiContext) {
    console.error("Failed to get 2D context for ASCII canvas.");
    return;
  }

  const clearButton = document.getElementById(
    "clearButton"
  ) as HTMLButtonElement;

  let defaultImageBitmap: ImageBitmap | null = null;
  let pixelator: Pixelator | null = null;
  let asciiConverter: AsciiConverter | null = null;

  function clearEffects(): void {
    if (!context || !asciiContext) {
      console.error("no context provided");
      return;
    }
    if (defaultImageBitmap) {
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(defaultImageBitmap, 0, 0);
    } else {
      context.clearRect(0, 0, canvas.width, canvas.height);
    }

    asciiContext.clearRect(0, 0, asciiCanvas.width, asciiCanvas.height);

    pixelationInput.value = "1";
    pixelationValueDisplay.textContent = "1";
  }

  imageInput.addEventListener("change", function (e: Event) {
    const target = e.target as HTMLInputElement;
    const file = target.files?.[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();

    reader.onload = function (event: ProgressEvent<FileReader>) {
      const img = new Image();
      img.onload = function () {
        canvas.width = img.width;
        canvas.height = img.height;
        asciiCanvas.width = img.width;
        asciiCanvas.height = img.height;

        context.drawImage(img, 0, 0);

        createImageBitmap(img).then((bitmap) => {
          defaultImageBitmap = bitmap;

          pixelator = new Pixelator(canvas, context);
          pixelator.setImage(defaultImageBitmap);

          asciiConverter = new AsciiConverter(asciiCanvas, asciiContext);
          asciiConverter.setImage(defaultImageBitmap);

          pixelator.setPixelSize(parseInt(pixelationInput.value));
          asciiConverter.setPixelSize(parseInt(pixelationInput.value));
        });
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  });

  blackWhiteButton.addEventListener("click", () => {
    if (!defaultImageBitmap) {
      console.error("Main: No image loaded to apply Black & White filter.");
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

  pixelateButton.addEventListener("click", () => {
    if (pixelator) {
      pixelator.pixelate();
    } else {
      console.error(
        "Main: Pixelator not initialized. Please load an image first."
      );
    }
  });

  pixelationInput.addEventListener("change", (event: Event) => {
    const target = event.target as HTMLInputElement;
    const newPixelSize = parseInt(target.value);
    pixelationValueDisplay.textContent = newPixelSize.toString();

    if (pixelator) {
      pixelator.setPixelSize(newPixelSize);
      pixelator.pixelate();
    } else {
      console.error(
        "Main: Pixelator not initialized. Please load an image first."
      );
    }
  });

  asciiButton.addEventListener("click", () => {
    if (asciiConverter) {
      asciiConverter.setPixelSize(parseInt(pixelationInput.value));
      asciiConverter.createAsciiArt();
    } else {
      console.error(
        "Main: AsciiConverter not initialized. Please load an image first."
      );
    }
  });

  clearButton.addEventListener("click", () => {
    clearEffects();
  });
}

main();
