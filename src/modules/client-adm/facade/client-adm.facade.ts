import { UseCaseInterface } from '../../@shared/use-case/use-case.interface'
import {
  AddClientFacadeInputDto,
  ClientAdmFacadeInterface,
  FindClientFacadeInputDto,
  FindClientFacadeOutputDto,
} from './client-adm.facade.interface'

export interface UseCasesProps {
  addUseCase: UseCaseInterface
  findUseCase: UseCaseInterface
}

export class ClientAdmFacade implements ClientAdmFacadeInterface {
  private _addUseCase: UseCaseInterface
  private _findUseCase: UseCaseInterface

  constructor(props: UseCasesProps) {
    this._addUseCase = props.addUseCase
    this._findUseCase = props.findUseCase
  }

  async add(input: AddClientFacadeInputDto): Promise<void> {
    await this._addUseCase.execute(input)
  }

  async find(
    input: FindClientFacadeInputDto,
  ): Promise<FindClientFacadeOutputDto> {
    return await this._findUseCase.execute(input)
  }
}
