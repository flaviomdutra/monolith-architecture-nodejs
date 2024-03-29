import { Sequelize } from 'sequelize-typescript'
import { ClientAdmFacadeFactory } from '../factory/client-adm.facade.factory'
import { ClientModel } from '../repository/client.model'

describe('ClientAdmFacade test', () => {
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
    const clientAdmFacade = ClientAdmFacadeFactory.create()

    const input = {
      id: '123',
      name: 'John Doe',
      email: 'jonh.doe@email.com',
      address: '1234 Elm Street',
    }

    await clientAdmFacade.add(input)

    const client = await ClientModel.findOne({
      where: { id: input.id },
    })

    expect(client).toBeDefined()
    expect(client.id).toBe(input.id)
    expect(client.name).toBe(input.name)
    expect(client.email).toBe(input.email)
    expect(client.address).toBe(input.address)
  })

  it('should find a client', async () => {
    const clientAdmFacade = ClientAdmFacadeFactory.create()

    const input = {
      id: '123',
      name: 'John Doe',
      email: 'jonh.doe@email.com',
      address: '1234 Elm Street',
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    await ClientModel.create(input)

    const client = await clientAdmFacade.find({ id: input.id })

    expect(client).toBeDefined()
    expect(client.id).toBe(input.id)
    expect(client.name).toBe(input.name)
    expect(client.email).toBe(input.email)
    expect(client.address).toBe(input.address)
    expect(client.createdAt).toEqual(input.createdAt)
    expect(client.updatedAt).toEqual(input.updatedAt)
  })
})
