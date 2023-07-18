import * as PIXI from "pixi.js";
// @ts-ignore
import * as TWEEN from "@tweenjs/tween.js";
import { Slot } from "./Slot.ts";
import { gameConfig } from "../config/GameConfig.ts";
import { globalSettings } from "../GlobalSettings.ts";

export class Reel extends PIXI.Container {
  private slots: Slot[] = [];

  private strip: number[];

  private background = new PIXI.Graphics();

  private slotWidth = 0;
  private slotHeight = 0;
  private visibleSymbols: number[];

  reelWidth: number;
  reelHeight: number;
  reelX: number;
  reelY: number;

  constructor(
    width: number,
    height: number,
    x: number,
    y: number,
    strip: number[],
    symbolsInit: number[]
  ) {
    super();

    this.reelWidth = width;
    this.reelHeight = height;
    this.reelX = x;
    this.reelY = y;
    this.strip = strip;
    this.visibleSymbols = symbolsInit;

    this.init();
  }

  private init = () => {
    this.generateSlots();
    this.draw();

    this.addChild(this.background);
    this.slots.forEach((slot) => {
      this.addChild(slot);
    });
  };

  private generateSlots = () => {
    this.calculateSlotDimensions();

    const stripSize = this.strip.length;
    for (let i = 0; i < stripSize; i++) {
      const slot: Slot = new Slot(
        this.strip[i],
        this.slotWidth,
        this.slotHeight
      );
      //console.log("this.reelHeight / 3 =", this.reelHeight / 3);
      this.slots.push(slot);
    }

    for (let i = 0; i < stripSize; i++) {
      const slot: Slot = new Slot(
        this.strip[i],
        this.slotWidth,
        this.slotHeight
      );
      //console.log("this.reelHeight / 3 =", this.reelHeight / 3);
      this.slots.push(slot);
    }

    this.setVisibleSymbolsConfig();

    this.setSlotPositions();

    /*this.slots.unshift(
      new Slot(this.strip[i + 1], this.reelWidth, this.reelHeight / 3)
    );
    this.slots.unshift(
      new Slot(this.strip[i], this.reelWidth, this.reelHeight / 3)
    );*/

    /*this.strip.forEach((idSymbol) => {
      const slot: Slot = new Slot(
        `${idSymbol}`,
        this.reelWidth,
        this.reelHeight / 3
      );
      this.slots.push(slot);
    });*/
  };

  private setSlotPositions = () => {
    let posY = this.reelY + this.slotHeight * 2;
    for (let i = this.slots.length - 1; i >= 0; i--) {
      this.slots[i].y = posY;
      this.slots[i].x = this.reelX;
      posY -= this.slotHeight;
    }
  };

  private calculateSlotDimensions = () => {
    this.slotWidth = this.reelWidth;
    this.slotHeight = this.reelHeight / 3;

    //console.log("this.slotWidth=",this.slotWidth,"this.slotHeight=",this.slotHeight);
  };

  private setVisibleSymbolsConfig = () => {
    let slotsReady = false;
    let idLastSlot = this.slots.length - 1;

    while (!slotsReady) {
      if (
        this.visibleSymbols[2] == this.slots[idLastSlot].idTexture &&
        this.visibleSymbols[1] == this.slots[idLastSlot - 1].idTexture &&
        this.visibleSymbols[0] == this.slots[idLastSlot - 2].idTexture
      ) {
        slotsReady = true;
      } else {
        const slotToMove = this.slots[idLastSlot];
        this.slots.pop();
        this.slots.unshift(slotToMove);
      }
    }
  };

  private draw = () => {
    this.background.beginFill(gameConfig.backgroundReelColor);
    this.background.drawRect(
      this.reelX,
      this.reelY,
      this.reelWidth,
      this.reelHeight
    );
    this.background.endFill();

    this.slots.forEach((slot) => {
      slot.width = this.slotWidth;
      slot.height = this.slotHeight;
      slot.x = this.reelX;
      //slot.y = this.reelY + slot.height * i;
    });

    this.setSlotPositions();
  };

  private calculateSpaceToMoveOnY = () => {
    //let i = 2;

    /*console.log("symbolsAfterSpin=",symbolsAfterSpin)
    while(true) {
      const firstIndex = (i >= this.slots.length ? 0 : i) ;
      const secondIndex = firstIndex + 1 >= this.slots.length ? 0 : firstIndex + 1;
      const thirdIndex = secondIndex + 1 >= this.slots.length ? 0 : secondIndex + 1;

      if(symbolsAfterSpin[0] == this.slots[firstIndex].idTexture && symbolsAfterSpin[1] == this.slots[secondIndex].idTexture && symbolsAfterSpin[2] == this.slots[thirdIndex].idTexture) {
        break;
      } else {
        i = firstIndex+1;
        spaceToMoveOnY+=this.reelHeight / 16;
      }
    }

    console.log("calculated space: spaceToMoveOnY=",spaceToMoveOnY);*/

    let spaceToMoveOnY = this.slotHeight;
    let stopCalculating = false;
    let idSlot = this.slots.length - 2;

    while (!stopCalculating) {
      if (
        this.visibleSymbols[2] == this.slots[idSlot].idTexture &&
        this.visibleSymbols[1] == this.slots[idSlot - 1].idTexture &&
        this.visibleSymbols[0] == this.slots[idSlot - 2].idTexture
      ) {
        stopCalculating = true;
      } else {
        spaceToMoveOnY += this.slotHeight;
        idSlot--;
      }
    }

    return spaceToMoveOnY;
  };

  animateReel = (
    symbolsAfterSpin: number[],
    duration: number,
    delayInMillis: number,
    animationFinishedEvent: () => void
  ) => {
    this.visibleSymbols = symbolsAfterSpin;
    const spaceToMoveOnY = this.calculateSpaceToMoveOnY();
    //console.log("this.reelHeight=", this.reelHeight);
    //console.log("spaceToMoveOnY=", spaceToMoveOnY);
    //const spaceToMoveOnY = 100;
    let lastY = 0;

    //const slotYPositionLimit = this.slots[this.slots.length-1].y + this.slots[this.slots.length-1].height;

    const position = { x: 0, y: 0, rotation: 0 };
    const positionEnd = { x: 0, y: spaceToMoveOnY, rotation: 0 };

    let tween = new TWEEN.Tween(position)
      .to(positionEnd, duration)
      .delay(delayInMillis)
      .easing(TWEEN.Easing.Bounce.Out)
      .onUpdate(() => {
        const deltaPosY = position.y - lastY;
        lastY = position.y;

        //console.log("positionIni:", position);
        //console.log("positionEnd:", positionEnd);
        //console.log("deltaPosY:", deltaPosY);

        //this.reelY += deltaPosY;

        this.slots.forEach((slot) => {
          slot.showSemiBlurredTexture();
          slot.moveVertical(deltaPosY);
          //if(slot.y > las)
        });

        //this.resize();
      });

    tween.start();

    tween.onComplete(() => {
      this.slots.forEach((slot) => {
        this.setVisibleSymbolsConfig();
        this.setSlotPositions();
        slot.showIdleTexture();
      });

      globalSettings.numberOfReelsSpinning--;

      animationFinishedEvent();
    });

    const animate = (time: number) => {
      tween.update(time);
      requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  };

  resize = () => {
    this.background.clear();
    this.calculateSlotDimensions();
    this.draw();
  };
}
