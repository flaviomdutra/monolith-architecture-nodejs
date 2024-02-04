import { Sequelize } from 'sequelize-typescript'
import { ProductAdmFacadeFactory } from '../factory/facade.factory'
import { ProductModel } from '../repository/product.model'

describe('ProductAdmFacade test', () => {
  let sequelize: Sequelize

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      logging: false,
      sync: { force: true },
    })

    sequelize.addModels([ProductModel])
    await sequelize.sync()
  })

  afterEach(async () => {
    await sequelize.close()
  })

  it('should add a product', async () => {
    const productAdmFacade = ProductAdmFacadeFactory.create()

    const input = {
      id: '1',
      name: 'Product 1',
      description: 'Product 1 description',
      purchasePrice: 100,
      stock: 10,
    }

    await productAdmFacade.addProduct(input)

    const product = await ProductModel.findOne({
      where: { id: input.id },
    })

    expect(input.id).toEqual(product.id)
    expect(input.name).toEqual(product.name)
    expect(input.description).toEqual(product.description)
    expect(input.purchasePrice).toEqual(product.purchasePrice)
    expect(input.stock).toEqual(product.stock)
  })

  it('should check stock of a product', async () => {
    const productAdmFacade = ProductAdmFacadeFactory.create()

    const input = {
      id: '1',
      name: 'Product 1',
      description: 'Product 1 description',
      purchasePrice: 100,
      stock: 10,
    }

    await productAdmFacade.addProduct(input)

    const result = await productAdmFacade.checkStock({ productId: '1' })

    expect(result.productId).toEqual(input.id)
    expect(result.stock).toEqual(input.stock)
  })
})
