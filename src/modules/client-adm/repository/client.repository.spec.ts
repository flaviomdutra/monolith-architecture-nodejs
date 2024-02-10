import { Sequelize } from 'sequelize-typescript'

import { Id } from '../../@shared/domain/value-object/id.value-object'
import { Client } from '../domain/client.entity'
import { ClientModel } from './client.model'
import { ClientRepository } from './client.repository'

describe('ClientRepository test', () => {
  let sequelize: Sequelize

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      logging: false,
      sync: { force: true },
    })

    sequelize.addModels([ClientModel])
    await sequelize.sync()
  })

  afterEach(async () => {
    await sequelize.close()
  })

  it('should create a client', async () => {
    const client = new Client({
      id: new Id('1'),
      name: 'John Doe',
      email: 'jonh.doe@email.com',
      address: '1234 Elm Street',
    })

    const repository = new ClientRepository()
    await repository.add(client)

    const clientDB = await ClientModel.findOne({ where: { id: client.id.id } })

    expect(clientDB.id).toEqual(client.id.id)
    expect(clientDB.name).toEqual(client.name)
    expect(clientDB.email).toEqual(client.email)
    expect(clientDB.address).toEqual(client.address)

    expect(clientDB.createdAt).toEqual(client.createdAt)
    expect(clientDB.updatedAt).toEqual(client.updatedAt)
  })

  it('should find a client', async () => {
    const client = await ClientModel.create({
      id: '1',
      name: 'John Doe',
      email: 'jonh.doe@email.com',
      address: '1234 Elm Street',
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    const repository = new ClientRepository()
    const result = await repository.find(client.id)

    expect(result.id.id).toEqual(client.id)
    expect(result.name).toEqual(client.name)
    expect(result.email).toEqual(client.email)
    expect(result.address).toEqual(client.address)
    expect(result.createdAt).toEqual(client.createdAt)
    expect(result.updatedAt).toEqual(client.updatedAt)
  })
})
