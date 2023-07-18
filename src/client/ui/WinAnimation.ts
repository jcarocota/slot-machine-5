import * as PIXI from "pixi.js";
// @ts-ignore
import * as TWEEN from "@tweenjs/tween.js";

export class WinAnimation extends PIXI.Container {
  private winAmount = 0;
  private textTitle: PIXI.Text = new PIXI.Text();
  private winAmountTitle: PIXI.Text = new PIXI.Text();
  private styleTitle: PIXI.TextStyle = new PIXI.TextStyle();
  private styleWinAmountTitle: PIXI.TextStyle = new PIXI.TextStyle();
  posX: number;
  posY: number;
  reelsWindowX: number;
  // @ts-ignore
  reelsWindowWidth: number;
  private offsetYTittle = 50;

  constructor(
    winAmount = 0,
    posX = 0,
    posY = 0,
    reelsWindowX = 0,
    reelsWindowWidth = 0
  ) {
    super();
    this.winAmount = winAmount;
    this.posX = posX;
    this.posY = posY;
    this.reelsWindowX = reelsWindowX;
    this.reelsWindowWidth = reelsWindowWidth;
    this.init();
  }

  private init = () => {
    this.styleTitle = new PIXI.TextStyle({
      fontFamily: "Arial",
      fontSize: 90,
      fontWeight: "bold",
      fill: ["#ffffff", "#ffaa00"], // gradient
      stroke: "#bb8204",
      strokeThickness: 5,
      dropShadow: true,
      dropShadowColor: "#000000",
      dropShadowBlur: 8,
      dropShadowAngle: Math.PI / 6,
      dropShadowDistance: 10,
      wordWrap: true,
      wordWrapWidth: 440,
      lineJoin: "round",
    });

    this.styleWinAmountTitle = new PIXI.TextStyle({
      fontFamily: "Arial",
      fontSize: 70,
      fontWeight: "bold",
      fill: ["#1a8500", "#00ff99"], // gradient
      stroke: "#003813",
      strokeThickness: 5,
      dropShadow: true,
      dropShadowColor: "#000000",
      dropShadowBlur: 8,
      dropShadowAngle: Math.PI / 6,
      dropShadowDistance: 10,
      wordWrap: true,
      wordWrapWidth: 440,
      lineJoin: "round",
    });
    this.textTitle = new PIXI.Text("¡Win!", this.styleTitle);
    this.winAmountTitle = new PIXI.Text(
      `$ ${this.winAmount.toFixed(2)} USD`,
      this.styleWinAmountTitle
    );

    this.draw();

    this.animateMoneyCount(1000);
    //this.animateTextMove(1000);

    this.addChild(this.textTitle);
    this.addChild(this.winAmountTitle);
  };

  private draw = () => {
    this.textTitle.anchor.set(0.5);
    this.textTitle.x = this.posX;
    this.textTitle.y = this.posY - this.offsetYTittle;

    this.winAmountTitle.anchor.set(0.5);
    this.winAmountTitle.x = this.posX;
    this.winAmountTitle.y = this.posY + this.offsetYTittle;
  };

  private animateMoneyCount = (duration: number) => {
    const position = { x: this.reelsWindowX, y: 0, rotation: 0, value: 0 };
    const positionEnd = {
      x: this.posX,
      y: 0,
      rotation: 0,
      value: this.winAmount,
    };

    const moneyTween = new TWEEN.Tween(position)
      .to(positionEnd, duration)
      .easing(TWEEN.Easing.Bounce.Out)
      .onUpdate(() => {
        // Actualiza el texto mientras la animación está en progreso
        this.winAmountTitle.text = `$ ${position.value.toFixed(2)} USD`; // Redondea el valor del texto
        this.textTitle.x = position.x;
      })
      .start();

    const moneyAnimate = (time: number) => {
      moneyTween.update(time);
      requestAnimationFrame(moneyAnimate);
    };
    requestAnimationFrame(moneyAnimate);
  };

  resize = () => {
    this.draw();
  };
}
