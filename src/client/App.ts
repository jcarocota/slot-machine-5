import * as PIXI from "pixi.js";
import { GameSocketClient } from "./ws/GameSocketClient.ts";
import { SlotMachine } from "./ui/SlotMachine.ts";
import { gameConfig } from "./config/GameConfig.ts";
import { globalSettings } from "./GlobalSettings.ts";
import {
  MoneyBalanceResponse,
  StripsResponse,
  SymbolsResponse,
} from "./ws/InterfaceResponse.ts";
import { LoadingBar } from "./ui/LoadingBar.ts";

export class App extends PIXI.Application {
  private static _instance: App;
  // @ts-ignore
  private slotMachine: SlotMachine;

  // @ts-ignore
  private loadingBar: LoadingBar;

  private gameSocketClient: GameSocketClient = GameSocketClient.instance;

  private constructor() {
    super({
      background: gameConfig.backgroundAppColor,
      resizeTo: window,
      resolution: devicePixelRatio,
    });

    this.loadApp();
  }

  private loadApp = () => {
    this.loadingBar = new LoadingBar();
    this.stage.addChild(this.loadingBar);

    this.loadGameData();
  };

  private loadGameData = () => {
    //we start with one dollar
    globalSettings.stake = 1;

    const setStrips = (data: any) => {
      const stripsResponse: StripsResponse = data;
      const stripsWSData = stripsResponse.strips;

      stripsWSData.forEach((stripWSData) => {
        const strip: number[] = [];
        for (const [, symbolSlot] of stripWSData.entries()) {
          strip.push(symbolSlot.id);
        }
        globalSettings.strips.push(strip);
        globalSettings.stripsWithActualOffset.push([...strip]);
      });

      //console.log("globalSettings.strips=", globalSettings.strips);
    };

    const setMoneyBalance = (data: any) => {
      const moneyBalanceResponse: MoneyBalanceResponse = data;
      globalSettings.moneyBalance = moneyBalanceResponse.moneyBalance;
      //console.log("globalSettings.moneyBalance=", globalSettings.moneyBalance);
    };

    const setSymbols = (data: any) => {
      const symbolsResponse: SymbolsResponse = data;
      globalSettings.symbols = symbolsResponse.symbols;
      //console.log("globalSettings.symbols=", globalSettings.symbols);
    };

    const checkIfAppLoaded = () => {
      /*console.log(
        "globalSettings.symbols.length=",
        globalSettings.symbols.length,
        "globalSettings.strips.length=",
        globalSettings.strips.length,
        "globalSettings.moneyBalance=",
        globalSettings.moneyBalance
      );*/
      if (
        globalSettings.symbols.length > 0 &&
        globalSettings.strips.length > 0 &&
        globalSettings.moneyBalance
      ) {
        PIXI.Ticker.shared.remove(checkIfAppLoaded);
        //console.log("App Loaded");
        this.loadGameAssets();
      }
    };

    PIXI.Ticker.shared.add(checkIfAppLoaded);

    //Load Symbols Info
    this.gameSocketClient.symbols(setSymbols);
    //console.info("Retrieving symbol's ID. Request ID:", idRequestSymbols);

    this.gameSocketClient.strips(setStrips);
    //console.info("Retrieving Strips. Request ID:", idRequestStrips);

    this.gameSocketClient.balance(setMoneyBalance);
    /*console.info(
      "Retrieving Money Balance. Request ID:",
      idRequestMoneyBalance
    );*/
  };

  private loadGameAssets = () => {
    let urlSpriteSheets: string[] = [];
    urlSpriteSheets.push(gameConfig.slotMachineSheet);
    urlSpriteSheets.push(gameConfig.slotMachineBlurredSheet);
    urlSpriteSheets.push(gameConfig.slotMachineSemiBlurredSheet);
    urlSpriteSheets.push(gameConfig.slotMachineDebugModeSheet);

    PIXI.Assets.load(urlSpriteSheets).then(
      (sheets: Record<string, PIXI.Spritesheet>) => {
        globalSettings.slotTextureSheet = sheets[gameConfig.slotMachineSheet];
        globalSettings.slotBlurredTextureSheet =
          sheets[gameConfig.slotMachineBlurredSheet];
        globalSettings.slotSemiBlurredTextureSheet =
          sheets[gameConfig.slotMachineSemiBlurredSheet];
        globalSettings.slotDebugModeTextureSheet =
          sheets[gameConfig.slotMachineDebugModeSheet];

        /*console.log(
          "globalSettings.slotTextureSheet=",
          globalSettings.slotTextureSheet
        );
        console.log(
          "globalSettings.slotBlurredTextureSheet=",
          globalSettings.slotBlurredTextureSheet
        );
        console.log(
          "globalSettings.slotSemiBlurredTextureSheet=",
          globalSettings.slotSemiBlurredTextureSheet
        );*/

        this.calculateWindowSize();
        this.calculateSlotMachineDimentions();
        this.calculateSlotMachinePosition();

        this.createUI();
        this.loadEvents();

        this.stage.removeChild(this.loadingBar);
      }
    );
  };

  private calculateWindowSize = () => {
    globalSettings.windowWidth = window.innerWidth;
    globalSettings.windowHeight = window.innerHeight;
    //alert(globalSettings.windowWidth +'x' +globalSettings.windowHeight);
  };

  private calculateSlotMachineDimentions = () => {
    // Calculate the aspect ratio of the screen
    const screenAspectRatio =
      globalSettings.windowWidth / globalSettings.windowHeight;

    // Calculate the width and height of the window based on a 16:9 aspect ratio
    let slotMachineWidth, slotMachineHeight;

    if (
      screenAspectRatio >=
      gameConfig.aspectRatioWidth / gameConfig.aspectRatioHeight
    ) {
      slotMachineWidth = Math.floor(
        globalSettings.windowHeight *
          (gameConfig.aspectRatioWidth / gameConfig.aspectRatioHeight)
      );
      slotMachineHeight = globalSettings.windowHeight;
    } else {
      slotMachineWidth = globalSettings.windowWidth;
      slotMachineHeight = Math.floor(
        globalSettings.windowWidth *
          (gameConfig.aspectRatioHeight / gameConfig.aspectRatioWidth)
      );
    }

    globalSettings.slotMachineWidth = slotMachineWidth;
    globalSettings.slotMachineHeight = slotMachineHeight;
  };

  private calculateSlotMachinePosition = () => {
    //We set the slot machine in the middle of the screen
    globalSettings.slotMachinePosX =
      (globalSettings.windowWidth - globalSettings.slotMachineWidth) / 2;
    globalSettings.slotMachinePosY =
      (globalSettings.windowHeight - globalSettings.slotMachineHeight) / 2;
  };

  private onWindowResize = () => {
    this.calculateWindowSize();
    this.calculateSlotMachineDimentions();
    this.calculateSlotMachinePosition();

    this.loadingBar.resize();
    this.slotMachine.resize();
  };

  private createUI = () => {
    this.slotMachine = new SlotMachine();
    this.stage.addChild(this.slotMachine);
  };

  private loadEvents = () => {
    //Add window rezise event. Slot Machine should resize too
    window.addEventListener("resize", this.onWindowResize);
  };

  //------

  static get instance(): App {
    if (!this._instance) {
      this._instance = new App();
    }

    return this._instance;
  }
}
