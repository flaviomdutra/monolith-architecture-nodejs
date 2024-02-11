import { Id } from '../../../@shared/domain/value-object/id.value-object'
import { UseCaseInterface } from '../../../@shared/use-case/use-case.interface'
import { ClientAdmFacadeInterface } from '../../../client-adm/facade/client-adm.facade.interface'
import { PaymentFacadeInterface } from '../../../payment/facade/facade.interface'
import { ProductAdmFacadeInterface } from '../../../product-adm/facade/product-adm.facade.interface'
import { StoreCatalogFacadeInterface } from '../../../store-catalog/facade/store-catalog.facade.interface'
import { Client } from '../../domain/client.entity'
import { Order } from '../../domain/order.entity'
import { Product } from '../../domain/product.entity'
import { CheckoutGateway } from '../../gateway/checkout.gateway'
import { PlaceOrderInputDto, PlaceOrderOutputDto } from './place-order.dto'

export class PlaceOrderUseCase implements UseCaseInterface {
  private _clientFacade: ClientAdmFacadeInterface
  private _productFacade: ProductAdmFacadeInterface
  private _catalogFacade: StoreCatalogFacadeInterface
  private _repository: CheckoutGateway
  private _invoiceFacade: any
  private _paymentFacade: PaymentFacadeInterface

  constructor(
    clientFacade: ClientAdmFacadeInterface,
    productFacade: ProductAdmFacadeInterface,
    catalogFacade: StoreCatalogFacadeInterface,
    repository: CheckoutGateway,
    invoiceFacade: any,
    paymentFacade: PaymentFacadeInterface,
  ) {
    this._clientFacade = clientFacade
    this._productFacade = productFacade
    this._catalogFacade = catalogFacade
    this._repository = repository
    this._invoiceFacade = invoiceFacade
    this._paymentFacade = paymentFacade
  }

  async execute(input: PlaceOrderInputDto): Promise<PlaceOrderOutputDto> {
    const client = await this._clientFacade.find({ id: input.clientId })
    if (!client) {
      throw new Error('Client not found')
    }

    await this._validateProducts(input)

    const products = await Promise.all(
      input.products.map((product) => this._getProduct(product.productId)),
    )

    const myClient = new Client({
      id: new Id(client.id),
      name: client.name,
      email: client.email,
      address: client.address,
    })

    const order = new Order({
      client: myClient,
      products,
    })

    const payment = await this._paymentFacade.process({
      orderId: order.id.id,
      amount: order.total,
    })

    const invoice =
      payment.status === 'approved'
        ? this._invoiceFacade.create({
            name: client.name,
            address: client.address,
            items: products.map((product) => ({
              id: product.id.id,
              name: product.name,
              price: product.salesPrice,
            })),
          }) && { id: 'invoice-id' } // @TODO: Implement Invoice Facade
        : null

    payment.status === 'approved' && order.approved()
    this._repository.addOrder(order)

    return {
      id: order.id.id,
      invoiceId: payment.status === 'approved' ? invoice.id : null,
      status: order.status,
      total: order.total,
      products: order.products.map((product) => ({
        productId: product.id.id,
      })),
    }
  }

  private async _validateProducts(input: PlaceOrderInputDto): Promise<void> {
    if (input.products.length === 0) {
      throw new Error('No products selected')
    }

    for (const product of input.products) {
      const productStock = await this._productFacade.checkStock({
        productId: product.productId,
      })
      if (productStock.stock <= 0) {
        throw new Error(
          `Product ${product.productId} is not available in stock`,
        )
      }
    }
  }

  private async _getProduct(productId: string): Promise<Product> {
    const product = await this._catalogFacade.find({ id: productId })

    if (!product) {
      throw new Error('Product not found')
    }

    return new Product({
      id: new Id(product.id),
      name: product.name,
      description: product.description,
      salesPrice: product.salesPrice,
    })
  }
}
