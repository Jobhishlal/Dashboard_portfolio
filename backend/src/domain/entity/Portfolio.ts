import { ERROR_MESSAGES } from "../../utils/messages";

export class Portfolio {
  constructor(
    public readonly symbol: string,
    public readonly purchasePrice: number,
    public readonly quantity: number,
    public readonly sector: string,
    public readonly exchange: string,
    public readonly id?: string
  ) {
    if (!symbol || !purchasePrice || !quantity || !sector || !exchange) {
      throw new Error(ERROR_MESSAGES.ALL_FIELDS_REQUIRED);
    }
  }

  // Inv = Purchase Price × Qty
  public getInvestment(): number {
    return this.purchasePrice * this.quantity;
  }

  // Present Value = CMP × Qty
  public getPresentValue(cmp: number): number {
    return cmp * this.quantity;
  }

  // Gain/Loss= Present Value – Investment
  public getGainLoss(cmp: number): number {
    return this.getPresentValue(cmp) - this.getInvestment();
  }

  // Portfolio (%): Proportional weight in the portfolio
  public getPortfolioPercentage(totalInvestment: number): number {
    if (totalInvestment === 0) return 0;
    return (this.getInvestment() / totalInvestment) * 100;
  }
}

