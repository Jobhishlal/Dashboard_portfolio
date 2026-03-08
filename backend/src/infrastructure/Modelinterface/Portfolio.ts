import { Document } from "mongoose"

export interface IPortfolio extends Document {

  symbol: string
  purchasePrice: number
  quantity: number
  sector: string
  exchange: string

}