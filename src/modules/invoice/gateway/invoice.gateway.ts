import { Invoice } from '../domain/invoice.entity'

export interface InvoiceGateway {
  generateInvoice: (invoice: Invoice) => Promise<void>
  findInvoice: (id: string) => Promise<Invoice | null>
}
