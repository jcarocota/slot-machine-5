import * as PIXI from "pixi.js";

export class LoadingBar extends PIXI.Container {
  private background = new PIXI.Graphics();

  private text = new PIXI.Text();

  constructor() {
    super();

    this.init();
  }

  private init = () => {
    this.draw();

    this.addChild(this.background);
    this.addChild(this.text);
  };

  private draw = () => {
    this.background.beginFill(0x00c5ff);
    this.background.drawRect(0, 0, window.innerWidth, window.innerHeight);
    this.background.endFill();

    this.text.anchor.set(0.5);
    this.text.x = window.innerWidth / 2;
    this.text.y = window.innerHeight / 2;
    this.text.style = {
      fontFamily: "Verdana",
      fontSize: 100,
      fill: ["#000000"],
    };
    this.text.text = "Loading...";
  };

  resize = () => {
    this.background.clear();
    this.draw();
  };
}
