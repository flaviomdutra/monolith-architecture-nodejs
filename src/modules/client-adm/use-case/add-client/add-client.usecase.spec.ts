import { AddClientUseCase } from './add-client.usecase'

const MockRepository = jest.fn(() => ({
  add: jest.fn(),
  find: jest.fn(),
}))

describe('Add Client Usecase unit test', () => {
  it('should add a client', async () => {
    const repository = MockRepository()
    const usecase = new AddClientUseCase(repository)

    const input = {
      id: '123',
      name: 'John Doe',
      email: 'jonh.doe@email.com',
      address: '1234 Elm Street',
    }

    const output = await usecase.execute(input)

    expect(repository.add).toHaveBeenCalled()
    expect(output.id).toBe(input.id)
    expect(output.name).toBe(input.name)
    expect(output.email).toBe(input.email)
    expect(output.address).toBe(input.address)
  })
})
