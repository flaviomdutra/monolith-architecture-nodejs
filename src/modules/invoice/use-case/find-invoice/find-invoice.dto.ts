export interface FindInvoiceUseCaseInputDTO {
  id: string
}

export interface FindInvoiceUseCaseOutputDTO {
  id: string
  name: string
  address: string
  items: {
    id: string
    name: string
    price: number
  }[]
  total: number
  createdAt: Date
}
