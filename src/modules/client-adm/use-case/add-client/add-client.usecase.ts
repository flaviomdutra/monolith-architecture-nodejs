import { Id } from '../../../@shared/domain/value-object/id.value-object'
import { UseCaseInterface } from '../../../@shared/use-case/use-case.interface'
import { Client } from '../../domain/client.entity'
import { ClientGateway } from '../../gateway/client.gateway'
import { AddClientInputDto, AddClientOutputDto } from './add-client.usecase.dto'

export class AddClientUseCase implements UseCaseInterface {
  private _clientRepository: ClientGateway
  constructor(clientRepository: ClientGateway) {
    this._clientRepository = clientRepository
  }

  async execute(input: AddClientInputDto): Promise<AddClientOutputDto> {
    const props = {
      name: input.name,
      email: input.email,
      address: input.address,
    }

    Object.assign(props, input.id && { id: new Id(input.id) })

    const client = new Client(props)
    this._clientRepository.add(client)

    return {
      id: client.id.id,
      name: client.name,
      email: client.email,
      address: client.address,
      createdAt: client.createdAt,
      updatedAt: client.updatedAt,
    }
  }
}
