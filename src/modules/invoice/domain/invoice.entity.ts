import { AggregateRoot } from '../../@shared/domain/entity/aggregate-root.interface'
import { BaseEntity } from '../../@shared/domain/entity/base.entity'
import { Id } from '../../@shared/domain/value-object/id.value-object'
import { InvoiceItem } from './invoice-item.entity'

type InvoiceProps = {
  id?: Id
  name: string
  address: string
  items: InvoiceItem[]
}

export class Invoice extends BaseEntity implements AggregateRoot {
  private _name: string
  private _address: string
  private _items: InvoiceItem[]

  constructor(props: InvoiceProps) {
    super(props.id)
    this._name = props.name
    this._address = props.address
    this._items = props.items
  }

  get name(): string {
    return this._name
  }

  get address(): string {
    return this._address
  }

  get items(): InvoiceItem[] {
    return this._items
  }

  get total(): number {
    return this._items.reduce((acc, item) => acc + item.price, 0)
  }
}
