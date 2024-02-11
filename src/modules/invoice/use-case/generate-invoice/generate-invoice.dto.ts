export interface GenerateInvoiceUseCaseInputDto {
  name: string
  address: string
  items: {
    id: string
    name: string
    price: number
  }[]
}

export interface GenerateInvoiceUseCaseOutputDto {
  id: string
  name: string
  address: string
  items: {
    id: string
    name: string
    price: number
  }[]
  total: number
}
