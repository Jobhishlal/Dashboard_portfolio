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
}

