export interface ProcessPaymentInputDto {
  orderId: string
  amount: number
}

export interface ProcessPaymentOutputDto {
  transactionId: string
  status: string
  amount: number
  orderId: string
  createdAt: Date
  updatedAt: Date
}
