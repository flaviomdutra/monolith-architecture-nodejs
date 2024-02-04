import { UseCaseInterface } from '../../@shared/use-case/use-case.interface'
import {
  AddProductFacadeInputDto,
  CheckStockFacadeInputDto,
  CheckStockFacadeOutputDto,
  ProductAdmFacadeInterface,
} from './product-adm.facade.interface'

export interface UseCasesProps {
  addUseCase: UseCaseInterface
  stockUseCase: UseCaseInterface
}

export class ProductAdmFacade implements ProductAdmFacadeInterface {
  private _addUseCase: UseCaseInterface
  private _checkStockUseCase: UseCaseInterface

  constructor(useCasesProps: UseCasesProps) {
    this._addUseCase = useCasesProps.addUseCase
    this._checkStockUseCase = useCasesProps.stockUseCase
  }

  async addProduct(input: AddProductFacadeInputDto): Promise<void> {
    return await this._addUseCase.execute(input)
  }

  async checkStock(
    input: CheckStockFacadeInputDto,
  ): Promise<CheckStockFacadeOutputDto> {
    return await this._checkStockUseCase.execute(input)
  }
}
