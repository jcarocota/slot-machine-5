import { Symbol } from "./Symbol.js";

const symbol00 = new Symbol(0, "Strawberry");
const symbol01 = new Symbol(1, "Watermelon");
const symbol02 = new Symbol(2, "Grape");
const symbol03 = new Symbol(3, "Orange");
//const //slotInfo04 = new Slot(4, 'Clover');
//const //slotInfo05 = new Slot(5, 'Apple');
//const //slotInfo06 = new Slot(6, 'Horseshoe');
//const //slotInfo07 = new Slot(7, 'Seven');

export const wildcardSymbol = new Symbol(4, "Diamond");
export const wildcardBigWinSymbol = new Symbol(5, "Big Win");

export const strips: Symbol[][] = [];
export const symbols: Symbol[] = [];

//Strip #01
strips.push([
  symbol01,
  symbol03,
  symbol02,
  symbol00,
  symbol02,
  symbol03,
  symbol01,
  symbol00,
  symbol03,
  symbol02,
  symbol00,
  symbol01,
  symbol01,
  symbol00,
  symbol03,
  symbol02,
  wildcardSymbol,
]);

//Strip #02
strips.push([
  symbol02,
  symbol00,
  symbol03,
  symbol01,
  symbol01,
  symbol00,
  symbol02,
  symbol03,
  symbol03,
  symbol01,
  symbol00,
  symbol02,
  symbol02,
  symbol03,
  symbol01,
  symbol00,
  wildcardSymbol,
]);

//Strip #03
strips.push([
  symbol03,
  symbol01,
  symbol02,
  symbol01,
  symbol02,
  symbol00,
  symbol00,
  symbol03,
  symbol02,
  symbol03,
  symbol01,
  symbol00,
  symbol03,
  symbol01,
  symbol00,
  symbol02,
  wildcardSymbol,
]);

//Strip #04
strips.push([
  symbol01,
  symbol03,
  symbol00,
  symbol02,
  symbol03,
  symbol00,
  symbol02,
  symbol01,
  symbol00,
  symbol02,
  symbol01,
  symbol03,
  symbol02,
  symbol01,
  symbol03,
  symbol00,
  wildcardSymbol,
]);

//Strip #05
strips.push([
  symbol01,
  symbol03,
  symbol00,
  symbol02,
  symbol03,
  symbol00,
  symbol02,
  symbol01,
  symbol00,
  symbol02,
  symbol01,
  symbol03,
  symbol02,
  symbol01,
  symbol03,
  symbol00,
  wildcardSymbol,
]);

symbols.push(symbol00);
symbols.push(symbol01);
symbols.push(symbol02);
symbols.push(symbol03);
symbols.push(wildcardSymbol);
symbols.push(wildcardBigWinSymbol);
