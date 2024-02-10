import { UseCaseInterface } from '../../@shared/use-case/use-case.interface'
import {
  PaymentFacadeInputDto,
  PaymentFacadeInterface,
  PaymentFacadeOutputDto,
} from './facade.interface'

export class PaymentFacade implements PaymentFacadeInterface {
  private _processPaymentUseCase: UseCaseInterface

  constructor(processPaymentUseCase: UseCaseInterface) {
    this._processPaymentUseCase = processPaymentUseCase
  }

  async process(input: PaymentFacadeInputDto): Promise<PaymentFacadeOutputDto> {
    return await this._processPaymentUseCase.execute(input)
  }
}
