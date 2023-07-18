import * as PIXI from "pixi.js";
import { gameConfig } from "../config/GameConfig.ts";

//https://codesandbox.io/s/pixi-select-oodt3d?file=/src/select.js:4032-4066

export type Option = {
  value: number;
  description: string;
};

export type stateUI = {
  backgroundColor: number;
};

export type MenuBackgroundOption = {
  option: Option;
  background: PIXI.Graphics;
  text: PIXI.Text;
  left: number;
  right: number;
  top: number;
  bottom: number;
};
export class SelectOneBox extends PIXI.Container {
  set boxUIOptions(backgroundColor: number) {
    this._boxUIOptions.backgroundColor = backgroundColor;
    this.resize();
  }
  set boxUIPointerHover(backgroundColor: number) {
    this._boxUIPointerHover.backgroundColor = backgroundColor;
    this.resize();
  }
  set boxUIReady(backgroundColor: number) {
    this._boxUIReady.backgroundColor = backgroundColor;
  }

  private options: Option[];

  private baseBackgroundColor = 0xffffff;

  private background = new PIXI.Graphics();
  private downArrow = new PIXI.Graphics();
  private selectedText = new PIXI.Text();

  private selectedValue: Option;

  private menu = new PIXI.Container();
  private menuBackgroundOptions: MenuBackgroundOption[] = [];

  selectOneBoxWidth: number;
  selectOneBoxHeight: number;
  selectOneBoxX: number;
  selectOneBoxY: number;
  labelText: string;
  selectionEvent: (info: any) => void;

  private _boxUIReady: stateUI = {
    backgroundColor: gameConfig.backgroundDefaultColor,
  };

  private _boxUIPointerHover: stateUI = {
    backgroundColor: gameConfig.backgroundDefaultColor,
  };

  private _boxUIOptions: stateUI = {
    backgroundColor: gameConfig.backgroundDefaultColor,
  };

  constructor(
    selectOneBoxWidth: number,
    selectOneBoxHeight: number,
    selectOneBoxX: number,
    selectOneBoxY: number,
    options: Option[],
    selectedValue: Option,
    labelText: string,
    selectionEvent: (info: any) => void
  ) {
    super();

    this.options = options;

    this.selectOneBoxWidth = selectOneBoxWidth;
    this.selectOneBoxHeight = selectOneBoxHeight;
    this.selectOneBoxX = selectOneBoxX;
    this.selectOneBoxY = selectOneBoxY;
    this.selectedValue = selectedValue;
    this.labelText = labelText;
    this.selectionEvent = selectionEvent;

    this.init();
  }

  private init = () => {
    this.createMenuOptions();

    this.addChild(this.background);
    //this.addChild(this.downArrow);

    this.draw();

    this.addChild(this.selectedText);
    this.addChild(this.menu);

    this.eventMode = "static";

    this.onpointermove = (e: PIXI.FederatedPointerEvent) => {
      this.highlightElements(e.y);
      this.menu.visible = true;
    };

    this.onpointerout = () => {
      this.menu.visible = false;
      this.unhighlightElements();
    };

    this.onpointerdown = (e: PIXI.FederatedPointerEvent) => {
      this.selectNewValue(e.x, e.y);
      this.menu.visible = false;
      this.unhighlightElements();
      this.selectionEvent(this.selectedValue.value);
    };

    this.showSelectedOptionText();
  };

  private draw = () => {
    this.background.beginFill(this.baseBackgroundColor);
    this.background.drawRect(
      this.selectOneBoxX,
      this.selectOneBoxY,
      this.selectOneBoxWidth,
      this.selectOneBoxHeight
    );
    this.background.endFill();

    this.background.tint = this._boxUIReady.backgroundColor;

    /*
    const triangleSideSize = this.width * 0.1;
    const triangleHalfway = triangleSideSize / 2;

    this.downArrow.beginFill(0x000);
    this.downArrow.moveTo(0, 0);
    this.downArrow.lineTo(triangleSideSize, 0);
    this.downArrow.lineTo(triangleHalfway, triangleSideSize * 0.6);
    this.downArrow.endFill();

    this.downArrow.position.x =
      this.selectOneBoxX + this.selectOneBoxWidth - triangleSideSize * 1.5;
    this.downArrow.position.y =
      this.selectOneBoxY + this.selectOneBoxHeight / 2;
      */

    this.selectedText.anchor.y = 0.5;
    this.selectedText.x = this.selectOneBoxX + this.selectOneBoxWidth * 0.1;
    this.selectedText.y = this.selectOneBoxY + this.selectOneBoxHeight / 2;

    this.menu.visible = false;

    this.menuBackgroundOptions.forEach((menuBackgroundOption, index) => {
      menuBackgroundOption.background.beginFill(this.baseBackgroundColor);

      const optionX = this.selectOneBoxX;
      const optionY =
        this.selectOneBoxY - this.selectOneBoxHeight * (index + 1);
      menuBackgroundOption.background.drawRect(
        optionX,
        optionY,
        this.selectOneBoxWidth,
        this.selectOneBoxHeight
      );
      menuBackgroundOption.background.endFill();

      menuBackgroundOption.text.y = 0.5;
      menuBackgroundOption.text.x =
        this.selectOneBoxX + this.selectOneBoxWidth * 0.1;
      menuBackgroundOption.text.y =
        this.selectOneBoxY +
        this.selectOneBoxHeight / 2 -
        this.selectOneBoxHeight * (index + 1);

      menuBackgroundOption.left = optionX;
      menuBackgroundOption.right = optionX + this.selectOneBoxWidth;
      menuBackgroundOption.top = optionY;
      menuBackgroundOption.bottom = optionY + this.selectOneBoxHeight;

      menuBackgroundOption.background.tint = this._boxUIOptions.backgroundColor;
    });
  };

  private showSelectedOptionText = () => {
    this.selectedText.text = this.labelText
      ? this.labelText + ": " + this.selectedValue.description
      : this.selectedValue.description;
    this.selectedText.style = {
      fontFamily: "Verdana",
      fontSize: 12,
      fill: ["#000000"],
    };
  };

  private createMenuOptions = () => {
    this.options.forEach((option: Option) => {
      const menuBackgroundOption: MenuBackgroundOption = {
        option: option,
        background: new PIXI.Graphics(),
        text: new PIXI.Text(),
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
      };

      menuBackgroundOption.text.anchor.y = 0.5;
      menuBackgroundOption.text.text = option.description;
      menuBackgroundOption.text.style = {
        fontFamily: "Verdana",
        fontSize: 12,
        fill: ["#000000"],
      };

      /*menuBackgroundOption.background.eventMode = "static";
      menuBackgroundOption.background.onpointerover = () =>
        (this.background.alpha = 0.5);
      menuBackgroundOption.background.onpointerout = () =>
        (this.background.alpha = 1);*/

      this.menuBackgroundOptions.push(menuBackgroundOption);

      this.menu.addChild(menuBackgroundOption.background);
      this.menu.addChild(menuBackgroundOption.text);
    });
  };

  private getSelectOneBoxBounds = () => {
    const top =
      this.selectOneBoxY -
      this.menuBackgroundOptions.length * this.selectOneBoxHeight;
    const bottom = this.selectOneBoxY + this.selectOneBoxHeight;
    const left = this.selectOneBoxX;
    const right = this.selectOneBoxX + this.selectOneBoxWidth;

    return { top, bottom, left, right };
  };

  private pointerInsideMenuZone: (mouseX: number, mouseY: number) => boolean = (
    mouseX,
    mouseY
  ) => {
    const bounds = this.getSelectOneBoxBounds();

    const top = bounds.top;
    const bottom = bounds.bottom;
    const left = bounds.left;
    const right = bounds.right;

    //console.log("top:", top, "bottom:", bottom, "left:", left, "right:", right);
    //console.log("mouseX:", mouseX, "mouseY:", mouseY);

    return mouseX > left && mouseX < right && mouseY < bottom && mouseY > top;
  };

  private highlightElements = (mouseY: number) => {
    const bounds = this.getSelectOneBoxBounds();

    //console.log("bounds:", bounds, "mouseY:",mouseY);

    if (mouseY < bounds.bottom && mouseY > this.selectOneBoxY) {
      this.background.tint = this._boxUIPointerHover.backgroundColor;
    }

    this.menuBackgroundOptions.forEach((menuBackgroundOption) => {
      //menuBackgroundOption.background.alpha = 0.6;
      menuBackgroundOption.background.tint =
        mouseY < menuBackgroundOption.bottom &&
        mouseY > menuBackgroundOption.top
          ? this._boxUIPointerHover.backgroundColor
          : this._boxUIOptions.backgroundColor;
    });
  };

  private unhighlightElements = () => {
    //this.background.alpha = 1;
    this.menuBackgroundOptions.forEach((menuBackgroundOption) => {
      menuBackgroundOption.background.tint = this._boxUIOptions.backgroundColor;
    });

    this.background.tint = this._boxUIReady.backgroundColor;
  };

  private selectNewValue = (mouseX: number, mouseY: number) => {
    const pointerInsideMenuZone = this.pointerInsideMenuZone(mouseX, mouseY);

    if (pointerInsideMenuZone) {
      this.menuBackgroundOptions.forEach((menuBackgroundOption) => {
        if (
          mouseY < menuBackgroundOption.bottom &&
          mouseY > menuBackgroundOption.top
        ) {
          this.selectedValue = menuBackgroundOption.option;
          this.showSelectedOptionText();
        }
      });
    }
  };

  resize = () => {
    this.background.clear();
    this.downArrow.clear();

    this.menuBackgroundOptions.forEach((menuBackgroundOption) => {
      menuBackgroundOption.background.clear();
    });

    this.draw();
  };
}
