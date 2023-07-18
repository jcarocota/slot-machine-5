import * as PIXI from "pixi.js";
//import * as TWEEN from "@tweenjs/tween.js";
import { Reel } from "./Reel.ts";
import { InitPositionsResponse } from "../ws/InterfaceResponse.ts";
import { globalSettings } from "../GlobalSettings.ts";
import { GameSocketClient } from "../ws/GameSocketClient.ts";

export class ReelsWindow extends PIXI.Container {
  private background = new PIXI.Graphics();

  private strips: number[][];

  private reels: Reel[] = [];

  private gameSocketClient: GameSocketClient = GameSocketClient.instance;

  private symbolsInit: number[][] = [];

  reelsWindowWidth: number;
  reelsWindowHeight: number;
  reelsWindowX: number;
  reelsWindowY: number;

  constructor(width: number, height: number, x: number, y: number) {
    super();

    this.reelsWindowWidth = width;
    this.reelsWindowHeight = height;
    this.reelsWindowX = x;
    this.reelsWindowY = y;

    this.strips = globalSettings.strips;

    //this.init();

    this.loadInitPositions();
  }

  private loadInitPositions = () => {
    const setInitPositions = (data: any) => {
      const initPositionsResponse: InitPositionsResponse = data;
      /*globalSettings.stripsWithActualOffset = [];

      globalSettings.strips.forEach((strip, i) => {
        const stripWithOffset: number[] = [];
        const numberOfSlotsByStrip = strip.length;

        let firstId = 0;
        let secondId = firstId + 1;
        let thirdId = secondId + 1;
        //strip.forEach((idSlot, j) => {
        for (let j = 0; j < numberOfSlotsByStrip; j++) {
          firstId = j;
          secondId = firstId + 1 > numberOfSlotsByStrip - 1 ? 0 : firstId + 1;
          thirdId = secondId + 1 > numberOfSlotsByStrip - 1 ? 0 : secondId + 1;

          if (
            strip[firstId] == symbolsArray[0][i] &&
            strip[secondId] == symbolsArray[1][i] &&
            strip[thirdId] == symbolsArray[2][i]
          ) {
            stripWithOffset.push(strip[firstId]);
            stripWithOffset.push(strip[secondId]);
            stripWithOffset.push(strip[thirdId]);
            break;
          }
        }

        const symbolsNeededToCompleteStrip =
          numberOfSlotsByStrip - stripWithOffset.length;

        let nextId = thirdId + 1;
        for (let j = 0; j < symbolsNeededToCompleteStrip; j++) {
          nextId = nextId > numberOfSlotsByStrip - 1 ? 0 : nextId;
          stripWithOffset.push(strip[nextId]);
          nextId++;
        }

        globalSettings.stripsWithActualOffset.push(stripWithOffset);
      });*/

      //console.log("symbolsArray=", symbolsArray);
      /*console.log(
        "globalSettings.stripsWithActualOffset=",
        globalSettings.stripsWithActualOffset
      );*/

      //this.strips = globalSettings.stripsWithActualOffset;

      this.symbolsInit = initPositionsResponse.symbolsArray;

      this.init();
    };

    const idRequestLoadInitPositions =
      this.gameSocketClient.initPositions(setInitPositions);
    console.info(
      "Retrieving symbol's ID init position. Request ID:",
      idRequestLoadInitPositions
    );
  };

  private init = () => {
    this.generateReels();
    this.draw();
    this.mask = this.background;

    //this.addChild(this.background);

    this.reels.forEach((reel) => {
      this.addChild(reel);
    });
  };

  private generateReels = () => {
    console.log("Generating reels");
    this.strips.forEach((strip, i) => {
      const columnSymbolsInit = [
        this.symbolsInit[0][i],
        this.symbolsInit[1][i],
        this.symbolsInit[2][i],
      ];

      console.log(
        "number of reel=",
        i,
        "columnSymbolsInit=",
        columnSymbolsInit
      );
      const reel: Reel = new Reel(
        this.reelsWindowWidth / 5,
        this.reelsWindowHeight, //(this.reelsWindowHeight / 3) * 16,
        this.reelsWindowX + (this.reelsWindowWidth / 5) * i,
        this.reelsWindowY,
        strip,
        columnSymbolsInit
      );
      this.reels.push(reel);
    });
  };

  fireSlotMachinePlay = (
    symbolsArray: number[][],
    animationFinishedEvent: () => void
  ) => {
    const durationWholeAnimation = 5000;
    const delayInMillis = 100;
    const minDurationReelAnimation = 1000;
    let reelAnimationDuration =
      durationWholeAnimation - delayInMillis * (this.reels.length - 1);

    reelAnimationDuration =
      reelAnimationDuration <= 0
        ? minDurationReelAnimation
        : reelAnimationDuration;

    this.reels.forEach((reel, i) => {
      const symbolsAfterSpin: number[] = [];

      symbolsArray.forEach((row) => {
        symbolsAfterSpin.push(row[i]);
      });

      reel.animateReel(
        symbolsAfterSpin,
        reelAnimationDuration,
        i * delayInMillis,
        animationFinishedEvent
      );
      globalSettings.numberOfReelsSpinning++;
      //console.log("Slot=", i, "delayInMillis=",i*delayInMillis);
    });
  };

  private draw = () => {
    this.background.beginFill(0xffffff);
    this.background.drawRect(
      this.reelsWindowX,
      this.reelsWindowY,
      this.reelsWindowWidth,
      this.reelsWindowHeight
    );
    this.background.endFill();

    this.reels.forEach((reel, i) => {
      reel.reelWidth = this.reelsWindowWidth / 5;
      reel.reelHeight = this.reelsWindowHeight;
      reel.reelX = this.reelsWindowX + (this.reelsWindowWidth / 5) * i;
      reel.reelY = this.reelsWindowY;
    });
  };

  resize = () => {
    this.background.clear();
    this.draw();

    this.reels.forEach((reel) => {
      reel.resize();
    });
  };
}
