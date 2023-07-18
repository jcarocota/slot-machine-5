import * as PIXI from "pixi.js";
import { ButtonState } from "./ButtonState.ts";
import { gameConfig } from "../config/GameConfig.ts";

export type stateUI = {
  backgroundColor: number;
  textLabel: string;
  state: ButtonState;
};

export class Button extends PIXI.Container {
  private background = new PIXI.Graphics();

  private text = new PIXI.Text();

  private _clickEvent: () => void;
  private _pointerOver: () => void;
  private _pointerOut: () => void;

  private defaultUI: stateUI = {
    backgroundColor: gameConfig.backgroundDefaultColor,
    textLabel: "",
    state: ButtonState.ready,
  };

  private buttonUI: stateUI = this.defaultUI;

  private _buttonUIReady: stateUI = {
    backgroundColor: gameConfig.backgroundDefaultColor,
    textLabel: "",
    state: ButtonState.ready,
  };
  private _buttonUIDisabled: stateUI = {
    backgroundColor: gameConfig.backgroundDefaultColor,
    textLabel: "",
    state: ButtonState.disabled,
  };
  private _buttonUIPointerHover: stateUI = {
    backgroundColor: gameConfig.backgroundDefaultColor,
    textLabel: "",
    state: ButtonState.pointerhover,
  };

  private _buttonState: ButtonState = ButtonState.ready;

  buttonWidth: number;
  buttonHeight: number;
  buttonX: number;
  buttonY: number;

  constructor(
    width: number,
    height: number,
    x: number,
    y: number,
    textLabel: string = "click",
    clickEvent: () => void = () => {},
    overEvent: () => void = () => {},
    outEvent: () => void = () => {}
  ) {
    super();

    this.buttonWidth = width;
    this.buttonHeight = height;
    this.buttonX = x;
    this.buttonY = y;
    this.buttonUI.textLabel = textLabel;
    this._clickEvent = clickEvent;
    this._pointerOver = overEvent;
    this._pointerOut = outEvent;

    this.init();
  }

  private init = () => {
    this.draw();

    this.addChild(this.background);
    this.addChild(this.text);

    this.eventMode = "static";
  };

  private draw = () => {
    this.background.beginFill(this.buttonUI.backgroundColor);
    this.background.drawRect(
      this.buttonX,
      this.buttonY,
      this.buttonWidth,
      this.buttonHeight
    );
    this.background.endFill();

    this.text.anchor.set(0.5);
    this.text.x = this.buttonX + this.buttonWidth / 2;
    this.text.y = this.buttonY + this.buttonHeight / 2;
    this.text.style = {
      fontFamily: "Verdana",
      fontSize: 20,
      fill: ["#000000"],
    };
    this.text.text = this.buttonUI.textLabel;
  };

  private applyUISettings = () => {
    let buttonUI: stateUI = this.defaultUI;

    switch (this._buttonState) {
      case ButtonState.ready:
        buttonUI = this._buttonUIReady ? this._buttonUIReady : buttonUI;
        //this.eventMode = "static";
        break;
      case ButtonState.pointerhover:
        buttonUI = this._buttonUIPointerHover
          ? this._buttonUIPointerHover
          : buttonUI;
        //console.log("Mouse over button");
        break;
      case ButtonState.disabled:
        buttonUI = this._buttonUIDisabled ? this._buttonUIDisabled : buttonUI;
        //this.eventMode = "auto";
        break;
    }

    this.buttonUI = buttonUI;
    this.resize();
  };

  get buttonState() {
    return this._buttonState;
  }

  set buttonState(value: ButtonState) {
    this._buttonState = value;
    this.applyUISettings();
  }

  set clickEvent(value: () => void) {
    this._clickEvent = value;
    this.onpointerup = this._clickEvent;
  }

  get clickEvent() {
    return this._clickEvent;
  }

  set pointerOver(value: () => void) {
    this._pointerOver = value;
    this.onpointerover = this._pointerOver;
  }

  set pointerOut(value: () => void) {
    this._pointerOut = value;
    this.onpointerout = this._pointerOut;
  }

  setButtonUIReady = (buttonColor: number, buttonTextLabel: string) => {
    this._buttonUIReady = {
      state: ButtonState.ready,
      backgroundColor: buttonColor,
      textLabel: buttonTextLabel,
    };
  };

  setButtonUIDisabled = (buttonColor: number, buttonTextLabel: string) => {
    this._buttonUIDisabled = {
      state: ButtonState.disabled,
      backgroundColor: buttonColor,
      textLabel: buttonTextLabel,
    };
  };

  setButtonUIPointerHover = (buttonColor: number, buttonTextLabel: string) => {
    this._buttonUIPointerHover = {
      state: ButtonState.pointerhover,
      backgroundColor: buttonColor,
      textLabel: buttonTextLabel,
    };
  };

  resize = () => {
    this.background.clear();
    this.draw();
  };
}
