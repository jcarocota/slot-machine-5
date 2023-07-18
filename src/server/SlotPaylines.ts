import { Payline } from "./Payline.js";

const paylineArray01: boolean[][] = [
  [false, false, false, false, false],
  [true, true, true, true, true],
  [false, false, false, false, false],
];

const paylineArray02: boolean[][] = [
  [true, true, true, true, true],
  [false, false, false, false, false],
  [false, false, false, false, false],
];

const paylineArray03: boolean[][] = [
  [false, false, false, false, false],
  [false, false, false, false, false],
  [true, true, true, true, true],
];

const paylineArray04: boolean[][] = [
  [true, false, false, false, true],
  [false, true, false, true, false],
  [false, false, true, false, false],
];

const paylineArray05: boolean[][] = [
  [false, false, true, false, false],
  [false, true, false, true, false],
  [true, false, false, false, true],
];

const paylineArray06: boolean[][] = [
  [true, true, false, true, true],
  [false, false, true, false, false],
  [false, false, false, false, false],
];

const paylineArray07: boolean[][] = [
  [false, false, false, false, false],
  [false, false, true, false, false],
  [true, true, false, true, true],
];

const paylineArray08: boolean[][] = [
  [false, false, false, false, false],
  [true, false, false, false, true],
  [false, true, true, true, false],
];

const paylineArray09: boolean[][] = [
  [false, true, true, true, false],
  [true, false, false, false, true],
  [false, false, false, false, false],
];

const paylineArray10: boolean[][] = [
  [false, true, false, true, false],
  [true, false, true, false, true],
  [false, false, false, false, false],
];

export const paylines: Payline[] = [];

paylines.push(new Payline(1, paylineArray01, "Payline 1"));
paylines.push(new Payline(2, paylineArray02, "Payline 2"));
paylines.push(new Payline(3, paylineArray03, "Payline 3"));
paylines.push(new Payline(4, paylineArray04, "Payline 4"));
paylines.push(new Payline(5, paylineArray05, "Payline 5"));
paylines.push(new Payline(6, paylineArray06, "Payline 6"));
paylines.push(new Payline(7, paylineArray07, "Payline 7"));
paylines.push(new Payline(8, paylineArray08, "Payline 8"));
paylines.push(new Payline(9, paylineArray09, "Payline 9"));
paylines.push(new Payline(10, paylineArray10, "Payline 10"));
