export class Payline {
  id: number;
  payline: boolean[][];
  description: string;

  constructor(id: number, payline: boolean[][], description: string) {
    this.id = id;
    this.payline = payline;
    this.description = description;
  }
}
