import { FindAllProductsUseCase } from '../use-case/find-all-products/find-all-products.usecase'
import { FindProductUseCase } from '../use-case/find-product/find-product.usecase'
import {
  FindAllStoreCatalogFacadeOutputDto,
  FindStoreCatalogFacadeInputDto,
  FindStoreCatalogFacadeOutputDto,
  StoreCatalogFacadeInterface,
} from './store-catalog.facade.interface'

export interface UseCaseProps {
  findUseCase: FindProductUseCase
  findAllUseCase: FindAllProductsUseCase
}

export class StoreCatalogFacade implements StoreCatalogFacadeInterface {
  private _findUseCase: FindProductUseCase
  private _findAllUseCase: FindAllProductsUseCase

  constructor(props: UseCaseProps) {
    this._findUseCase = props.findUseCase
    this._findAllUseCase = props.findAllUseCase
  }

  async find(
    id: FindStoreCatalogFacadeInputDto,
  ): Promise<FindStoreCatalogFacadeOutputDto> {
    return await this._findUseCase.execute(id)
  }

  async findAll(): Promise<FindAllStoreCatalogFacadeOutputDto> {
    return await this._findAllUseCase.execute()
  }
}
