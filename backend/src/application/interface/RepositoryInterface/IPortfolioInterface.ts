import { Portfolio } from "../../../domain/entity/Portfolio";

export interface IPortfolioDatabaseinterface{
  create(data: Portfolio): Promise<Portfolio>

  findAll(page?: number, limit?: number): Promise<Portfolio[]>
  count(): Promise<number>

  findBysymbol(symbol: string): Promise<Portfolio | null>

  update( symbol: string, data: Partial<Portfolio>): Promise<Portfolio | null>

  delete(symbol: string): Promise<boolean>
}