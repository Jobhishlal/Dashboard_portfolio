import { Schema, model, Document } from "mongoose"
import { IPortfolio } from "../Modelinterface/Portfolio"


const portfolioSchema = new Schema<IPortfolio>({
  symbol: {
    type: String,
    required: true
  },
  purchasePrice: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  sector: {
    type: String
  },
  exchange: {
    type: String
  }
},
  {
    timestamps: true
  })

export const PortfolioModel = model<IPortfolio>("Portfolio", portfolioSchema)