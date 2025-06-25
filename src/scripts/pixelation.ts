export class Pixelator {
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  private sourceImageBitmap: ImageBitmap | null = null;
  private pixelSize: number = 1;

  constructor(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) {
    this.canvas = canvas;
    this.context = context;
  }

  setImage(imageBitmap: ImageBitmap): void {
    this.sourceImageBitmap = imageBitmap;
  }

  setPixelSize(size: number): void {
    this.pixelSize = size;
  }

  pixelate(): void {
    if (!this.sourceImageBitmap) {
      console.error("Pixelator: No image loaded to pixelate.");
      return;
    }

    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.context.drawImage(this.sourceImageBitmap, 0, 0);

    const imageData = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
    const data = imageData.data;
    const pixelSize = this.pixelSize;

    for (let y = 0; y < this.canvas.height; y += pixelSize) {
      for (let x = 0; x < this.canvas.width; x += pixelSize) {
        let r = 0,
          g = 0,
          b = 0,
          a = 0;
        let count = 0;

        for (let dy = 0; dy < pixelSize; dy++) {
          for (let dx = 0; dx < pixelSize; dx++) {
            const currentX = x + dx;
            const currentY = y + dy;

            if (currentX < this.canvas.width && currentY < this.canvas.height) {
              const index = (currentY * this.canvas.width + currentX) * 4;
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

            if (currentX < this.canvas.width && currentY < this.canvas.height) {
              const index = (currentY * this.canvas.width + currentX) * 4;
              data[index] = r;
              data[index + 1] = g;
              data[index + 2] = b;
              data[index + 3] = a;
            }
          }
        }
      }
    }
    this.context.putImageData(imageData, 0, 0);
  }
}
