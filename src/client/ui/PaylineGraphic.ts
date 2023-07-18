import * as PIXI from "pixi.js";

export class PaylineGraphic extends PIXI.Container {
  private paylinePoints: boolean[][];
  slotHeight: number;
  slotWidth: number;
  reelsWindowX: number;
  reelsWindowY: number;
  private coincidences: number;
  private numberOfPointsToDraw: number;

  private line: PIXI.Graphics = new PIXI.Graphics();

  constructor(
    paylinePoints: boolean[][],
    coincidences: number,
    slotWidth = 0,
    slotHeight = 0,
    reelsWindowX = 0,
    reelsWindowY = 0
  ) {
    super();

    this.paylinePoints = paylinePoints;
    this.slotWidth = slotWidth;
    this.slotHeight = slotHeight;
    this.reelsWindowX = reelsWindowX;
    this.reelsWindowY = reelsWindowY;
    this.coincidences = coincidences;
    this.numberOfPointsToDraw = coincidences;

    this.init();
  }

  private init = () => {
    this.numberOfPointsToDraw = this.coincidences;
    this.draw();

    this.addChild(this.line);
  };

  private draw = () => {
    const colorLine = this.generateRandomColor();
    this.line.lineStyle(10, colorLine);
    this.line.moveTo(this.reelsWindowX, this.reelsWindowY);

    const numRows = 3;
    const numColumns = 5;

    for (let columnID = 0; columnID < numColumns; columnID++) {
      for (let rowID = 0; rowID < numRows; rowID++) {
        if (this.paylinePoints[rowID][columnID]) {
          let pointX =
            this.reelsWindowX + this.slotWidth / 2 + this.slotWidth * columnID;
          let pointY =
            this.reelsWindowY + this.slotHeight / 2 + this.slotHeight * rowID;

          if (columnID == 0) {
            this.line.moveTo(pointX, pointY);
          } else {
            this.line.lineTo(pointX, pointY);
          }

          this.numberOfPointsToDraw--;

          if (!this.numberOfPointsToDraw) {
            break;
          }
        }
      }
      if (!this.numberOfPointsToDraw) {
        break;
      }
    }
  };

  private generateRandomColor = () => {
    let r = Math.floor(Math.random() * 256); // Rojo
    let g = Math.floor(Math.random() * 256); // Verde
    let b = Math.floor(Math.random() * 256); // Azul

    return (
      "#" +
      this.componentToHex(r) +
      this.componentToHex(g) +
      this.componentToHex(b)
    );
  };

  // Función auxiliar para convertir un componente de color decimal a hexadecimal
  private componentToHex = (color: number) => {
    var hex = color.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
  };

  resize = () => {
    this.numberOfPointsToDraw = this.coincidences;
    this.line.clear();
    this.draw();
  };
}
