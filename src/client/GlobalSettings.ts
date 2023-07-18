import * as PIXI from "pixi.js";
import { SymbolSlot } from "./ws/InterfaceResponse.ts";
import { gameConfig } from "./config/GameConfig.ts";

interface GlobalSettings {
  idCheat: number;
  lastRoundStake: number;
  lastRoundWinning: number;
  moneyBalance: number | undefined;
  numberOfReelsSpinning: number;
  windowWidth: number;
  windowHeight: number;
  slotMachineWidth: number;
  slotMachineHeight: number;
  slotMachinePosX: number;
  slotMachinePosY: number;
  slotTextureSheet?: PIXI.Spritesheet;
  slotBlurredTextureSheet?: PIXI.Spritesheet;
  slotSemiBlurredTextureSheet?: PIXI.Spritesheet;
  slotDebugModeTextureSheet?: PIXI.Spritesheet;
  stake: number;
  symbols: SymbolSlot[];
  strips: number[][];
  stripsWithActualOffset: number[][];
  questionMarkTexture: PIXI.Texture;
}

export const globalSettings: GlobalSettings = {
  idCheat: -1,
  lastRoundStake: 0,
  lastRoundWinning: 0,
  moneyBalance: undefined,
  numberOfReelsSpinning: 0,
  windowWidth: 0,
  windowHeight: 0,
  slotMachineWidth: 0,
  slotMachineHeight: 0,
  slotMachinePosX: 0,
  slotMachinePosY: 0,
  stake: 0,
  symbols: [],
  strips: [],
  stripsWithActualOffset: [],
  questionMarkTexture: PIXI.Texture.from(gameConfig.questionMarkAsset),
};
