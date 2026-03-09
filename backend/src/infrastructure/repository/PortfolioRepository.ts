import { Portfolio } from "../../domain/entity/Portfolio";
import { PortfolioModel } from "../model/PortfolioModel";
import { PortfolioMapper } from "../mappers/portfoliomapper";
import { IPortfolioDatabaseinterface } from "../../application/interface/RepositoryInterface/IPortfolioInterface";


export class PortFolioDatas implements IPortfolioDatabaseinterface{

    async create(data: Portfolio): Promise<Portfolio> {
        const portfoliodata= PortfolioMapper.toPersistence(data)
        const document = await PortfolioModel.create(portfoliodata)
        return PortfolioMapper.toDomain(document)
    }
   
     async findAll(page?: number, limit?: number): Promise<Portfolio[]> {
         let query = PortfolioModel.find();
         
         if (page && limit) {
             const skip = (page - 1) * limit;
             query = query.skip(skip).limit(limit);
         }
         
         const doc = await query;
         return doc.map(doc => PortfolioMapper.toDomain(doc));
     }

     async count(): Promise<number> {
         return await PortfolioModel.countDocuments();
     }
     async findBysymbol(symbol: string): Promise<Portfolio | null> {
        const doc  = await PortfolioModel.findOne({symbol})
        if(!doc){
            return null
        }
        return PortfolioMapper.toDomain(doc)
         
     }
      async update(symbol: string, data: Partial<Portfolio>): Promise<Portfolio | null> {
         
        const doc = await PortfolioModel.findByIdAndUpdate(symbol,{
            data,
            new:true
        })
        if(!doc){
            throw new Error("Symbol Id Missing")
        }
        return PortfolioMapper.toDomain(doc)
         
     }
     async delete(symbol: string): Promise<boolean> {
         await PortfolioModel.deleteOne({ symbol })

    return true

     }

}