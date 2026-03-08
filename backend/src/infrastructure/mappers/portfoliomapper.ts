import { IPortfolio } from "../Modelinterface/Portfolio";
import { Portfolio } from "../../domain/entity/Portfolio";


export class PortfolioMapper {

  static toDomain(doc: IPortfolio): Portfolio {
    return new Portfolio(
      doc.symbol,
      doc.purchasePrice,
      doc.quantity,
      doc.sector,
      doc.exchange,
      doc._id?.toString()
    );
  }


  static toPersistence(entity: Portfolio) {
    return {
      symbol: entity.symbol,
      purchasePrice: entity.purchasePrice,
      quantity: entity.quantity,
      sector: entity.sector,
      exchange: entity.exchange
    };
  }


}