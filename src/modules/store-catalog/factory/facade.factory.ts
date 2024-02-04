import { StoreCatalogFacade } from '../facade/store-catalog.facade'
import { ProductRepository } from '../repository/product.repository'
import { FindAllProductsUseCase } from '../use-case/find-all-products/find-all-products.usecase'
import { FindProductUseCase } from '../use-case/find-product/find-product.usecase'

export class StoreCatalogFacadeFactory {
  static create() {
    const productRepository = new ProductRepository()
    const findProductUseCase = new FindProductUseCase(productRepository)
    const findAllProductsUseCase = new FindAllProductsUseCase(productRepository)

    const facade = new StoreCatalogFacade({
      findUseCase: findProductUseCase,
      findAllUseCase: findAllProductsUseCase,
    })

    return facade
  }
}
