import { UseCaseInterface } from '../../../@shared/use-case/use-case.interface'
import { Transaction } from '../../domain/transaction'
import { PaymentGateway } from '../../gateway/payment.gateway'
import {
  ProcessPaymentInputDto,
  ProcessPaymentOutputDto,
} from './process-payment.dto'

export class ProcessPaymentUseCase implements UseCaseInterface {
  private _transactionRepository: PaymentGateway

  constructor(transactionRepository: PaymentGateway) {
    this._transactionRepository = transactionRepository
  }

  async execute(
    input: ProcessPaymentInputDto,
  ): Promise<ProcessPaymentOutputDto> {
    const transaction = new Transaction({
      orderId: input.orderId,
      amount: input.amount,
    })

    transaction.process()

    const persistTransaction =
      await this._transactionRepository.save(transaction)

    return {
      transactionId: persistTransaction.id.id,
      orderId: persistTransaction.orderId,
      amount: persistTransaction.amount,
      status: persistTransaction.status,
      createdAt: persistTransaction.createdAt,
      updatedAt: persistTransaction.updatedAt,
    }
  }
}
