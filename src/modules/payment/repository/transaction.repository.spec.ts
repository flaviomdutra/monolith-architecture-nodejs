import { Sequelize } from 'sequelize-typescript'

import { Id } from '../../@shared/domain/value-object/id.value-object'
import { Transaction } from '../domain/transaction'
import { TransactionModel } from './transaction.model'
import { TransactionRepository } from './transaction.repository'

describe('TransactionRepository test', () => {
  let sequelize: Sequelize

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      logging: false,
      sync: { force: true },
    })

    sequelize.addModels([TransactionModel])
    await sequelize.sync()
  })

  afterEach(async () => {
    await sequelize.close()
  })

  it('should save a Transaction', async () => {
    const transaction = new Transaction({
      id: new Id('1'),
      orderId: '1',
      amount: 100,
    })

    transaction.approve()

    const repository = new TransactionRepository()
    await repository.save(transaction)

    const TransactionDB = await TransactionModel.findOne({
      where: { id: transaction.id.id },
    })

    expect(TransactionDB.id).toEqual(transaction.id.id)
    expect(TransactionDB.orderId).toEqual(transaction.orderId)
    expect(TransactionDB.amount).toEqual(transaction.amount)
    expect(TransactionDB.status).toEqual('approved')
    expect(TransactionDB.createdAt).toEqual(transaction.createdAt)
    expect(TransactionDB.updatedAt).toEqual(transaction.updatedAt)
  })
})
