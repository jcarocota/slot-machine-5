import * as PIXI from "pixi.js";
import { globalSettings } from "../GlobalSettings.ts";
import { Button } from "./Button.ts";
import { InfoBar } from "./InfoBar.ts";
import { ReelsWindow } from "./ReelsWindow.ts";
import { Option, SelectOneBox } from "./SelectOneBox.ts";
import { GameSocketClient } from "../ws/GameSocketClient.ts";
import { ButtonState } from "./ButtonState.ts";
import { SpinResponse } from "../ws/InterfaceResponse.ts";
import { PaylineGraphic } from "./PaylineGraphic.ts";
import { WinAnimation } from "./WinAnimation.ts";
import { gameConfig } from "../config/GameConfig.ts";

export class SlotMachine extends PIXI.Container {
  private background = new PIXI.Graphics();
  // @ts-ignore
  private playButton: Button;

  // @ts-ignore
  private infoBar: InfoBar;

  // @ts-ignore
  private reelsWindow: ReelsWindow;

  // @ts-ignore
  private stakeSelectOneBox: SelectOneBox;

  // @ts-ignore
  private cheatPanelSelectOneBox: SelectOneBox;

  private paylineGraphics: PaylineGraphic[] = [];
  private winningsGraphics: WinAnimation[] = [];

  // @ts-ignore
  private lastSpinResponse: SpinResponse | undefined;

  constructor() {
    super();
    this.init();
  }

  private init = () => {
    this.createPlayButton();
    this.createInfoBar();
    this.createReelsWindow();
    this.createStakeSelectOneBox();
    this.createCheatPanel();

    this.draw();

    this.addChild(this.background);
    this.addChild(this.infoBar);
    this.addChild(this.reelsWindow);
    this.addChild(this.stakeSelectOneBox);
    this.addChild(this.playButton);
    this.addChild(this.cheatPanelSelectOneBox);
  };

  private draw = () => {
    this.background.beginFill(gameConfig.backgroundSlotMachineColor);
    this.background.drawRect(
      globalSettings.slotMachinePosX,
      globalSettings.slotMachinePosY,
      globalSettings.slotMachineWidth,
      globalSettings.slotMachineHeight
    );
    this.background.endFill();
  };

  private createPlayButton = () => {
    const { buttonWidth, buttonHeight, buttonX, buttonY } =
      this.calculateBoundsPlayButton();

    this.playButton = new Button(buttonWidth, buttonHeight, buttonX, buttonY);

    this.playButton.setButtonUIReady(
      gameConfig.playButtonUI.backgroundIdleColor,
      gameConfig.playButtonUI.textIdle
    );
    this.playButton.setButtonUIDisabled(
      gameConfig.playButtonUI.backgroundDisabledColor,
      gameConfig.playButtonUI.textDisabled
    );
    this.playButton.setButtonUIPointerHover(
      gameConfig.playButtonUI.backgroundHoverColor,
      gameConfig.playButtonUI.textHover
    );

    this.playButton.buttonState = ButtonState.ready;

    this.playButton.pointerOver = () => {
      //console.log("Mouse over button", "this.eventMode=", this.eventMode);
      if (this.playButton.buttonState != ButtonState.disabled) {
        this.playButton.buttonState = ButtonState.pointerhover;
      }
    };

    this.playButton.pointerOut = () => {
      //console.log("Mouse out button", "this.eventMode=",this.eventMode);
      if (this.playButton.buttonState != ButtonState.disabled) {
        this.playButton.buttonState = ButtonState.ready;
      }
    };

    this.playButton.clickEvent = () => {
      if (this.playButton.buttonState == ButtonState.disabled) {
        return;
      }

      this.paylineGraphics.forEach((paylineGraphic) => {
        this.removeChild(paylineGraphic);
      });

      this.winningsGraphics.forEach((winningGraphic) => {
        this.removeChild(winningGraphic);
      });

      this.paylineGraphics = [];
      this.winningsGraphics = [];

      this.playButton.buttonState = ButtonState.disabled;
      const socket = GameSocketClient.instance;
      const afterSpinEvent = (data: any) => {
        const spinResponse: SpinResponse = data;
        this.lastSpinResponse = spinResponse;
        //console.log("Symbols after spín=", spinResponse.symbolsArray);
        this.reelsWindow.fireSlotMachinePlay(
          spinResponse.symbolsArray,
          this.slotMachineIsStopped
        );
      };

      if (globalSettings.idCheat < 0) {
        socket.spin(globalSettings.stake, afterSpinEvent);
      } else {
        socket.cheat(
          globalSettings.stake,
          globalSettings.idCheat,
          afterSpinEvent
        );
      }
      globalSettings.lastRoundStake = globalSettings.stake;
      globalSettings.lastRoundWinning = 0;

      //PIXI.Ticker.shared.add(this.slotMachineIsStopped);
    };
  };

  private slotMachineIsStopped = () => {
    //console.log("Waiting... globalSettings.numberOfReelsSpinning=",globalSettings.numberOfReelsSpinning)
    if (globalSettings.numberOfReelsSpinning == 0) {
      PIXI.Ticker.shared.remove(this.slotMachineIsStopped);

      this.playButton.buttonState = ButtonState.ready;

      if (this.lastSpinResponse) {
        const amountTotalWin = this.lastSpinResponse.amountTotalWin;
        this.lastSpinResponse.gottenPaylinesInfo.forEach((paylineInfo) => {
          const reelsWindowSize = this.calculateBoundsReelsWindow();
          const paylineGraphic: PaylineGraphic = new PaylineGraphic(
            paylineInfo.payline.payline,
            paylineInfo.numberOfCoincidences,
            reelsWindowSize.reelsWindowWidth / 5,
            reelsWindowSize.reelsWindowHeight / 3,
            reelsWindowSize.reelsWindowX,
            reelsWindowSize.reelsWindowY
          );
          this.addChild(paylineGraphic);
          this.paylineGraphics.push(paylineGraphic);

          const reelsWindowBounds = this.calculateBoundsReelsWindow();
          const winAnimation: WinAnimation = new WinAnimation(
            amountTotalWin,
            reelsWindowBounds.reelsWindowX +
              reelsWindowBounds.reelsWindowWidth / 2,
            reelsWindowBounds.reelsWindowY +
              reelsWindowBounds.reelsWindowHeight / 2,
            reelsWindowBounds.reelsWindowX,
            reelsWindowBounds.reelsWindowWidth
          );
          this.addChild(winAnimation);
          this.winningsGraphics.push(winAnimation);

          this.removeChild(this.stakeSelectOneBox);
          this.removeChild(this.cheatPanelSelectOneBox);
          this.addChild(this.stakeSelectOneBox);
          this.addChild(this.cheatPanelSelectOneBox);
        });

        globalSettings.moneyBalance = this.lastSpinResponse.moneyBalance;
        globalSettings.lastRoundWinning = this.lastSpinResponse.amountTotalWin;

        this.lastSpinResponse = undefined;
      }
    }
  };

  private createInfoBar = () => {
    const frameRateInfoBounds = this.calculateBoundsInfoBar();
    this.infoBar = new InfoBar(
      frameRateInfoBounds.labelX,
      frameRateInfoBounds.labelY,
      frameRateInfoBounds.infoBarWidth,
      frameRateInfoBounds.infoBarHeight,
      frameRateInfoBounds.barX,
      frameRateInfoBounds.barY
    );

    this.infoBar.setInfoBarUI(
      gameConfig.infoBarUI.backgroundColor,
      gameConfig.infoBarUI.textColor
    );
  };

  private createReelsWindow = () => {
    //console.log("Creating reels window");
    const { reelsWindowWidth, reelsWindowHeight, reelsWindowX, reelsWindowY } =
      this.calculateBoundsReelsWindow();
    this.reelsWindow = new ReelsWindow(
      reelsWindowWidth,
      reelsWindowHeight,
      reelsWindowX,
      reelsWindowY
    );
  };

  private createStakeSelectOneBox = () => {
    const stakeSelectOneBoxBounds = this.calculateBoundsStakeSelectOneBox();
    const options: Option[] = [];
    options.push({ value: 1, description: "1.00 USD" });
    options.push({ value: 1.5, description: "1.50 USD" });
    options.push({ value: 2, description: "2.00 USD" });
    options.push({ value: 5, description: "5.00 USD" });
    options.push({ value: 10, description: "10.00 USD" });
    options.push({ value: 20, description: "20.00 USD" });
    options.push({ value: 50, description: "50.00 USD" });
    options.push({ value: 75, description: "75.00 USD" });
    options.push({ value: 100, description: "100.00 USD" });

    const setStakeInfo = (newStake: number) => {
      //console.log("globalSettings.stake=", globalSettings.stake)
      globalSettings.stake = newStake;
      //console.log("(new value) globalSettings.stake=", globalSettings.stake)
    };

    this.stakeSelectOneBox = new SelectOneBox(
      stakeSelectOneBoxBounds.stakeSelectOneBoxWidth,
      stakeSelectOneBoxBounds.stakeSelectOneBoxHeight,
      stakeSelectOneBoxBounds.stakeSelectOneBoxX,
      stakeSelectOneBoxBounds.stakeSelectOneBoxY,
      options,
      options[0],
      "Stake",
      setStakeInfo
    );

    this.stakeSelectOneBox.boxUIReady =
      gameConfig.stakeSelectBoxUI.backgroundIdleColor;
    this.stakeSelectOneBox.boxUIOptions =
      gameConfig.stakeSelectBoxUI.backgroundOptionsIdleColor;
    this.stakeSelectOneBox.boxUIPointerHover =
      gameConfig.stakeSelectBoxUI.backgroundHoverColor;
  };

  private createCheatPanel = () => {
    const cheatPanelBounds = this.calculateBoundsCheatPanelSelectOneBox();

    const options: Option[] = [];
    options.push({ value: -1, description: "Regular spin" });
    options.push({ value: 0, description: "1 pyl: 3 sym" });
    options.push({ value: 1, description: "1 pyl: 4 sym" });
    options.push({ value: 2, description: "1 pyl: 5 sym" });
    options.push({ value: 3, description: "2 pyl: 4 & 4 sym" });
    options.push({ value: 4, description: "3 pyl: 4, 4 & 4 sym" });
    options.push({ value: 5, description: "2 pyl: 5 & 3 sym" });
    options.push({ value: 6, description: "3 pyl: 5, 3 & 3 sym" });
    options.push({ value: 7, description: "3 pyl: 5, 4 & 3 sym" });

    const setCheatStatus = (idCheat: number) => {
      globalSettings.idCheat = idCheat;
    };

    this.cheatPanelSelectOneBox = new SelectOneBox(
      cheatPanelBounds.cheatPanelSelectOneBoxWidth,
      cheatPanelBounds.cheatPanelSelectOneBoxHeight,
      cheatPanelBounds.cheatPanelSelectOneBoxX,
      cheatPanelBounds.cheatPanelSelectOneBoxY,
      options,
      options[0],
      "cheat",
      setCheatStatus
    );

    this.cheatPanelSelectOneBox.boxUIReady =
      gameConfig.cheatPanelSelectBoxUI.backgroundIdleColor;
    this.cheatPanelSelectOneBox.boxUIOptions =
      gameConfig.cheatPanelSelectBoxUI.backgroundOptionsIdleColor;
    this.cheatPanelSelectOneBox.boxUIPointerHover =
      gameConfig.cheatPanelSelectBoxUI.backgroundHoverColor;
  };

  private calculateBoundsPlayButton = () => {
    const buttonWidth = globalSettings.slotMachineWidth * 0.25;
    const buttonHeight = globalSettings.slotMachineHeight * 0.2;
    const buttonX =
      globalSettings.slotMachinePosX +
      globalSettings.slotMachineWidth -
      buttonWidth;
    const buttonY =
      globalSettings.slotMachinePosY +
      globalSettings.slotMachineHeight -
      buttonHeight;

    return { buttonWidth, buttonHeight, buttonX, buttonY };
  };

  private calculateBoundsInfoBar = () => {
    const infoBarWidth = globalSettings.slotMachineWidth * 0.75;
    const infoBarHeight = globalSettings.slotMachineHeight * 0.05;

    const labelX = globalSettings.slotMachinePosX;
    const labelY =
      globalSettings.slotMachinePosY +
      globalSettings.slotMachineHeight -
      infoBarHeight / 2;

    const barX = globalSettings.slotMachinePosX;
    const barY =
      globalSettings.slotMachinePosY +
      globalSettings.slotMachineHeight -
      infoBarHeight;

    return {
      labelX,
      labelY,
      infoBarWidth,
      infoBarHeight,
      barX,
      barY,
    };
  };

  private calculateBoundsReelsWindow = () => {
    //const reelsWindowWidth = globalSettings.slotMachineWidth*0.8;
    const reelsWindowWidth = globalSettings.slotMachineWidth;
    const reelsWindowHeight = globalSettings.slotMachineHeight * 0.8;
    //const reelsWindowX = globalSettings.slotMachinePosX + globalSettings.slotMachineWidth*0.1;
    const reelsWindowX = globalSettings.slotMachinePosX;
    const reelsWindowY = globalSettings.slotMachinePosY;

    return { reelsWindowWidth, reelsWindowHeight, reelsWindowX, reelsWindowY };
  };

  private calculateBoundsStakeSelectOneBox = () => {
    const stakeSelectOneBoxWidth = globalSettings.slotMachineWidth * 0.2;
    const stakeSelectOneBoxHeight = globalSettings.slotMachineHeight * 0.05;
    const stakeSelectOneBoxX =
      globalSettings.slotMachinePosX +
      globalSettings.slotMachineWidth -
      globalSettings.slotMachineWidth * 0.25 -
      stakeSelectOneBoxWidth;
    const stakeSelectOneBoxY =
      globalSettings.slotMachinePosY +
      globalSettings.slotMachineHeight -
      stakeSelectOneBoxHeight * 2;

    return {
      stakeSelectOneBoxWidth,
      stakeSelectOneBoxHeight,
      stakeSelectOneBoxX,
      stakeSelectOneBoxY,
    };
  };

  private calculateBoundsCheatPanelSelectOneBox = () => {
    const cheatPanelSelectOneBoxWidth = globalSettings.slotMachineWidth * 0.2;
    const cheatPanelSelectOneBoxHeight =
      globalSettings.slotMachineHeight * 0.05;
    const cheatPanelSelectOneBoxX =
      globalSettings.slotMachinePosX +
      globalSettings.slotMachineWidth -
      globalSettings.slotMachineWidth * 0.25 -
      cheatPanelSelectOneBoxWidth * 2;
    const cheatPanelSelectOneBoxY =
      globalSettings.slotMachinePosY +
      globalSettings.slotMachineHeight -
      cheatPanelSelectOneBoxHeight * 2;

    return {
      cheatPanelSelectOneBoxWidth,
      cheatPanelSelectOneBoxHeight,
      cheatPanelSelectOneBoxX,
      cheatPanelSelectOneBoxY,
    };
  };

  resize = () => {
    this.background.clear();
    this.draw();

    const playButtonBounds = this.calculateBoundsPlayButton();
    this.playButton.buttonWidth = playButtonBounds.buttonWidth;
    this.playButton.buttonHeight = playButtonBounds.buttonHeight;
    this.playButton.buttonX = playButtonBounds.buttonX;
    this.playButton.buttonY = playButtonBounds.buttonY;
    this.playButton.resize();

    const infoBarBounds = this.calculateBoundsInfoBar();
    this.infoBar.textX = infoBarBounds.labelX;
    this.infoBar.textY = infoBarBounds.labelY;
    this.infoBar.barX = infoBarBounds.barX;
    this.infoBar.barY = infoBarBounds.barY;
    this.infoBar.barWidth = infoBarBounds.infoBarWidth;
    this.infoBar.barHeight = infoBarBounds.infoBarHeight;
    this.infoBar.resize();

    const reelsWindowBounds = this.calculateBoundsReelsWindow();
    this.reelsWindow.reelsWindowWidth = reelsWindowBounds.reelsWindowWidth;
    this.reelsWindow.reelsWindowHeight = reelsWindowBounds.reelsWindowHeight;
    this.reelsWindow.reelsWindowX = reelsWindowBounds.reelsWindowX;
    this.reelsWindow.reelsWindowY = reelsWindowBounds.reelsWindowY;
    this.reelsWindow.resize();

    const stakeSelectOneBoxBounds = this.calculateBoundsStakeSelectOneBox();
    this.stakeSelectOneBox.selectOneBoxWidth =
      stakeSelectOneBoxBounds.stakeSelectOneBoxWidth;
    this.stakeSelectOneBox.selectOneBoxHeight =
      stakeSelectOneBoxBounds.stakeSelectOneBoxHeight;
    this.stakeSelectOneBox.selectOneBoxX =
      stakeSelectOneBoxBounds.stakeSelectOneBoxX;
    this.stakeSelectOneBox.selectOneBoxY =
      stakeSelectOneBoxBounds.stakeSelectOneBoxY;
    this.stakeSelectOneBox.resize();

    const cheatPanelSelectOneBoxBounds =
      this.calculateBoundsCheatPanelSelectOneBox();
    this.cheatPanelSelectOneBox.selectOneBoxWidth =
      cheatPanelSelectOneBoxBounds.cheatPanelSelectOneBoxWidth;
    this.cheatPanelSelectOneBox.selectOneBoxHeight =
      cheatPanelSelectOneBoxBounds.cheatPanelSelectOneBoxHeight;
    this.cheatPanelSelectOneBox.selectOneBoxX =
      cheatPanelSelectOneBoxBounds.cheatPanelSelectOneBoxX;
    this.cheatPanelSelectOneBox.selectOneBoxY =
      cheatPanelSelectOneBoxBounds.cheatPanelSelectOneBoxY;
    this.cheatPanelSelectOneBox.resize();

    this.paylineGraphics.forEach((paylineGraphic) => {
      paylineGraphic.slotWidth = reelsWindowBounds.reelsWindowWidth / 5;
      paylineGraphic.slotHeight = reelsWindowBounds.reelsWindowHeight / 3;
      paylineGraphic.reelsWindowX = reelsWindowBounds.reelsWindowX;
      paylineGraphic.reelsWindowY = reelsWindowBounds.reelsWindowY;
      paylineGraphic.resize();
    });

    this.winningsGraphics.forEach((winAnimation) => {
      /*
      * const winAnimation: WinAnimation = new WinAnimation(
            amountTotalWin,
            reelsWindowBounds.reelsWindowX +
              reelsWindowBounds.reelsWindowWidth / 2,
            reelsWindowBounds.reelsWindowY +
              reelsWindowBounds.reelsWindowHeight / 2,
            reelsWindowBounds.reelsWindowX,
            reelsWindowBounds.reelsWindowWidth
          );
      * */
      winAnimation.posX =
        reelsWindowBounds.reelsWindowX + reelsWindowBounds.reelsWindowWidth / 2;
      winAnimation.posY =
        reelsWindowBounds.reelsWindowY +
        reelsWindowBounds.reelsWindowHeight / 2;
      winAnimation.reelsWindowX = reelsWindowBounds.reelsWindowX;
      winAnimation.reelsWindowWidth = reelsWindowBounds.reelsWindowWidth;

      winAnimation.resize();
    });
  };
}
