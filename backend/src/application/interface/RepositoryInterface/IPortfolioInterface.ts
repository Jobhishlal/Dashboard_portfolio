import { Portfolio } from "../../../domain/entity/Portfolio";

export interface IPortfolioDatabaseinterface{
  create(data: Portfolio): Promise<Portfolio>

  findAll(): Promise<Portfolio[]>

  findBysymbol(symbol: string): Promise<Portfolio | null>

  update( symbol: string, data: Partial<Portfolio>): Promise<Portfolio | null>

  delete(symbol: string): Promise<boolean>
}