import { UseCaseInterface } from '../../../@shared/use-case/use-case.interface'
import { ClientAdmFacadeInterface } from '../../../client-adm/facade/client-adm.facade.interface'
import { PlaceOrderInputDto, PlaceOrderOutputDto } from './place-order.dto'

export class PlaceOrderUseCase implements UseCaseInterface {
  private _clientFacade: ClientAdmFacadeInterface

  constructor(clientFacade: ClientAdmFacadeInterface) {
    this._clientFacade = clientFacade
  }

  async execute(input: PlaceOrderInputDto): Promise<PlaceOrderOutputDto> {
    const client = await this._clientFacade.find({ id: input.clientId })
    if (!client) {
      throw new Error('Client not found')
    }

    return {
      id: 'order-id',
      invoiceId: 'invoice-id',
      total: 0,
      products: input.products,
    }
  }
}
