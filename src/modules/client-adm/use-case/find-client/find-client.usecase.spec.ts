import { Id } from '../../../@shared/domain/value-object/id.value-object'
import { Client } from '../../domain/client.entity'
import { FindClientUsecase } from './find-client.usecase'

const client = new Client({
  id: new Id('123'),
  name: 'John Doe',
  email: 'jonh.doe@email.com',
  address: '1234 Elm Street',
})
const MockRepository = jest.fn(() => ({
  add: jest.fn(),
  find: jest.fn().mockReturnValue(Promise.resolve(client)),
}))

describe('Find Client Usecase unit test', () => {
  it('should find a client', async () => {
    const repository = MockRepository()
    const usecase = new FindClientUsecase(repository)

    const input = {
      id: '123',
    }

    const output = await usecase.execute(input)

    expect(repository.find).toHaveBeenCalled()
    expect(output.id).toBe(input.id)
    expect(output.name).toBe(client.name)
    expect(output.email).toBe(client.email)
    expect(output.address).toBe(client.address)
    expect(output.createdAt).toBe(client.createdAt)
    expect(output.updatedAt).toBe(client.updatedAt)
  })
})
