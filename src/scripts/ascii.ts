export class AsciiConverter {
  private asciiCanvas: HTMLCanvasElement;
  private asciiContext: CanvasRenderingContext2D;
  private sourceImageBitmap: ImageBitmap | null = null;
  private pixelSize: number = 1;
  private maximumBrightnessDifference = 10;

  constructor(
    asciiCanvas: HTMLCanvasElement,
    asciiContext: CanvasRenderingContext2D
  ) {}

  setImage(imageBitmap: ImageBitmap): void {
    this.sourceImageBitmap = imageBitmap;
  }

  setPixelSize(size: number): void {
    this.pixelSize = size;
  }

  private getBrightness(r: number, g: number, b: number): number {
    return r * 0.299 + g * 0.587 + b * 0.114;
  }

  private symbolByBrightness(brightness: number) {
    switch (true) {
      case brightness >= 252: {
        return ".";
      }
      case brightness >= 210: {
        return ",";
      }
      case brightness >= 168: {
        return ":";
      }
      case brightness >= 126: {
        return "%";
      }
      case brightness >= 84: {
        return "$";
      }
      case brightness >= 42: {
        return "*";
      }
      default: {
        return "#";
      }
    }
  }

  checkPattern(pixelsArray: number[]) {

  }

  createAsciiArt(): void {
    const asciiImageData = this.asciiContext.createImageData()
  }
}
