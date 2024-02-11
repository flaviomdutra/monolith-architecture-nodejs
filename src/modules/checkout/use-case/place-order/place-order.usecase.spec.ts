import { Id } from '../../../@shared/domain/value-object/id.value-object'
import { Product } from '../../domain/product.entity'
import { PlaceOrderInputDto } from './place-order.dto'
import { PlaceOrderUseCase } from './place-order.usecase'

const mockDate = new Date(2000, 1, 1)

describe('PlaceOrderUseCase unit test', () => {
  describe('validateProducts method', () => {
    // @ts-expect-error - no params in constructor
    const placeOrderUseCase = new PlaceOrderUseCase()

    it('should throw an error when no products selected', async () => {
      const input: PlaceOrderInputDto = {
        clientId: 'client-id',
        products: [],
      }

      // @ts-expect-error - force call private method
      await expect(placeOrderUseCase._validateProducts(input)).rejects.toThrow(
        new Error('No products selected'),
      )
    })

    it('should not throw an error when product is out of stock', async () => {
      const mockProductFacade = {
        checkStock: jest.fn(({ productId }: { productId: string }) =>
          Promise.resolve({
            productId,
            stock: productId === 'product-id' ? 0 : 1,
          }),
        ),
      }

      // @ts-expect-error - force set productFacade
      placeOrderUseCase._productFacade = mockProductFacade

      const input: PlaceOrderInputDto = {
        clientId: 'client-id',
        products: [{ productId: 'product-id' }],
      }

      // @ts-expect-error - force call private method
      expect(placeOrderUseCase._validateProducts(input)).rejects.toThrow(
        new Error('Product product-id is not available in stock'),
      )

      input.products = [
        { productId: 'product-id' },
        { productId: 'product-id-02' },
      ]

      // @ts-expect-error - force call private method
      expect(placeOrderUseCase._validateProducts(input)).rejects.toThrow(
        new Error('Product product-id is not available in stock'),
      )
      expect(mockProductFacade.checkStock).toHaveBeenCalledTimes(2)

      input.products = [
        { productId: 'product-id' },
        { productId: 'product-id-02' },
        { productId: 'product-id-03' },
      ]

      // @ts-expect-error - force call private method
      await expect(placeOrderUseCase._validateProducts(input)).rejects.toThrow(
        new Error('Product product-id is not available in stock'),
      )
      expect(mockProductFacade.checkStock).toHaveBeenCalledTimes(3)
    })
  })

  describe('getProducts method', () => {
    beforeAll(() => {
      jest.useFakeTimers()
      jest.setSystemTime(mockDate)
    })

    afterAll(() => {
      jest.useRealTimers()
    })

    // @ts-expect-error - no params in constructor
    const placeOrderUseCase = new PlaceOrderUseCase()

    it('should throw an error when product not found', async () => {
      const mockCatalogFacade = {
        find: jest.fn().mockResolvedValue(null),
      }

      // @ts-expect-error - force set productFacade
      placeOrderUseCase._catalogFacade = mockCatalogFacade

      // @ts-expect-error - force call private method
      await expect(placeOrderUseCase._getProduct('product-id')).rejects.toThrow(
        new Error('Product not found'),
      )
    })

    it('should return a product', async () => {
      const mockCatalogFacade = {
        find: jest.fn().mockResolvedValue({
          id: 'product-id',
          name: 'product-name',
          description: 'product-description',
          salesPrice: 0,
        }),
      }

      // @ts-expect-error - force set catalogFacade
      placeOrderUseCase._catalogFacade = mockCatalogFacade

      expect(
        // @ts-expect-error - force call private method
        placeOrderUseCase._getProduct('product-id'),
      ).resolves.toEqual(
        new Product({
          id: new Id('product-id'),
          name: 'product-name',
          description: 'product-description',
          salesPrice: 0,
        }),
      )
      expect(mockCatalogFacade.find).toHaveBeenCalledTimes(1)
    })
  })

  describe('execute method', () => {
    beforeAll(() => {
      jest.useFakeTimers()
      jest.setSystemTime(mockDate)
    })

    afterAll(() => {
      jest.useRealTimers()
    })

    it('should throw an error when client not found', async () => {
      const mockClientFacade = {
        find: jest.fn().mockResolvedValue(null),
      }

      // @ts-expect-error - no params in constructor
      const placeOrderUseCase = new PlaceOrderUseCase()
      // @ts-expect-error - force set clientFacade
      placeOrderUseCase._clientFacade = mockClientFacade

      const input: PlaceOrderInputDto = {
        clientId: 'client-id',
        products: [],
      }

      await expect(placeOrderUseCase.execute(input)).rejects.toThrow(
        new Error('Client not found'),
      )
    })

    it('should throw an error when product are not valid', async () => {
      const mockClientFacade = {
        find: jest.fn().mockResolvedValue(true),
      }

      // @ts-expect-error - no params in constructor
      const placeOrderUseCase = new PlaceOrderUseCase()

      const mockValidateProducts = jest
        // @ts-expect-error - spy on private method
        .spyOn(placeOrderUseCase, '_validateProducts')
        // @ts-expect-error - not return never
        .mockRejectedValue(new Error('No products selected'))

      // @ts-expect-error - force set clientFacade
      placeOrderUseCase._clientFacade = mockClientFacade

      const input: PlaceOrderInputDto = {
        clientId: 'client-id',
        products: [],
      }

      await expect(placeOrderUseCase.execute(input)).rejects.toThrow(
        new Error('No products selected'),
      )
      expect(mockValidateProducts).toHaveBeenCalledTimes(1)
    })

    describe('place an order', () => {
      const clientProps = {
        id: 'client-id',
        name: 'client-name',
        email: 'client-email@email.com',
        address: 'client-address',
      }

      const mockClientFacade = {
        find: jest.fn().mockResolvedValue(clientProps),
        add: jest.fn(),
      }

      const mockPaymentFacade = {
        process: jest.fn(),
      }

      const mockCheckoutRepo = {
        addOrder: jest.fn(),
        findOrder: jest.fn(),
      }

      const mockInvoiceFacade = {
        create: jest.fn().mockResolvedValue({ id: 'invoice-id' }),
      }

      const placeOrderUseCase = new PlaceOrderUseCase(
        mockClientFacade,
        null,
        null,
        mockCheckoutRepo,
        mockInvoiceFacade,
        mockPaymentFacade,
      )

      const products = {
        'product-id': {
          id: new Id('product-id'),
          name: 'product-name',
          description: 'product-description',
          salesPrice: 40,
        },
        'product-id-02': {
          id: new Id('product-id-02'),
          name: 'product-name-02',
          description: 'product-description-02',
          salesPrice: 30,
        },
      }

      const mockValidateProducts = jest
        // @ts-expect-error - spy on private method
        .spyOn(placeOrderUseCase, '_validateProducts')
        // @ts-expect-error - not return never
        .mockResolvedValue(null)

      const mockGetProduct = jest
        // @ts-expect-error - spy on private method
        .spyOn(placeOrderUseCase, '_getProduct')
        // @ts-expect-error - not return never
        .mockImplementation((productId: keyof typeof products) => {
          return products[productId]
        })

      it('should not be approved', async () => {
        mockPaymentFacade.process = mockPaymentFacade.process.mockReturnValue({
          transactionId: 'transaction-id',
          orderId: 'order-id',
          amount: 100,
          status: 'error',
          createdAt: new Date(),
          updateAt: new Date(),
        })

        const input: PlaceOrderInputDto = {
          clientId: 'client-id',
          products: [
            { productId: 'product-id' },
            { productId: 'product-id-02' },
          ],
        }

        const output = await placeOrderUseCase.execute(input)

        expect(output.invoiceId).toBeNull()
        expect(output.total).toBe(70)
        expect(output.products).toStrictEqual([
          { productId: 'product-id' },
          { productId: 'product-id-02' },
        ])
        expect(mockClientFacade.find).toHaveBeenCalledTimes(1)
        expect(mockClientFacade.find).toHaveBeenCalledWith({ id: 'client-id' })
        expect(mockValidateProducts).toHaveBeenCalledTimes(1)
        expect(mockValidateProducts).toHaveBeenCalledWith(input)
        expect(mockGetProduct).toHaveBeenCalledTimes(2)
        expect(mockCheckoutRepo.addOrder).toHaveBeenCalledTimes(1)
        expect(mockPaymentFacade.process).toHaveBeenCalledTimes(1)
        expect(mockPaymentFacade.process).toHaveBeenCalledWith({
          orderId: output.id,
          amount: output.total,
        })
        expect(mockInvoiceFacade.create).toHaveBeenCalledTimes(0)
      })

      it('should be approved', async () => {
        mockPaymentFacade.process = mockPaymentFacade.process.mockReturnValue({
          transactionId: 'transaction-id',
          orderId: 'order-id',
          amount: 100,
          status: 'approved',
          createdAt: new Date(),
          updateAt: new Date(),
        })

        const input: PlaceOrderInputDto = {
          clientId: 'client-id',
          products: [
            { productId: 'product-id' },
            { productId: 'product-id-02' },
          ],
        }

        const output = await placeOrderUseCase.execute(input)

        expect(output.invoiceId).toBe('invoice-id')
        expect(output.total).toBe(70)
        expect(output.products).toStrictEqual([
          { productId: 'product-id' },
          { productId: 'product-id-02' },
        ])
        expect(mockClientFacade.find).toHaveBeenCalledTimes(1)
        expect(mockClientFacade.find).toHaveBeenCalledWith({ id: 'client-id' })
        expect(mockValidateProducts).toHaveBeenCalledTimes(1)
        expect(mockGetProduct).toHaveBeenCalledTimes(2)
        expect(mockCheckoutRepo.addOrder).toHaveBeenCalledTimes(1)
        expect(mockPaymentFacade.process).toHaveBeenCalledTimes(1)
        expect(mockPaymentFacade.process).toHaveBeenCalledWith({
          orderId: output.id,
          amount: output.total,
        })
        expect(mockInvoiceFacade.create).toHaveBeenCalledTimes(1)
        expect(mockInvoiceFacade.create).toHaveBeenCalledWith({
          name: clientProps.name,
          address: clientProps.address,
          items: [
            {
              id: products['product-id'].id.id,
              name: products['product-id'].name,
              price: products['product-id'].salesPrice,
            },
            {
              id: products['product-id-02'].id.id,
              name: products['product-id-02'].name,
              price: products['product-id-02'].salesPrice,
            },
          ],
        })
      })
    })
  })
})
