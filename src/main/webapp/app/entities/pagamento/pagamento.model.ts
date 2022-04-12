import { IFrete } from 'app/entities/frete/frete.model';

export interface IPagamento {
  id?: number;
  valor?: number | null;
  parcela?: number | null;
  formaPagamento?: string | null;
  frete?: IFrete | null;
}

export class Pagamento implements IPagamento {
  constructor(
    public id?: number,
    public valor?: number | null,
    public parcela?: number | null,
    public formaPagamento?: string | null,
    public frete?: IFrete | null
  ) {}
}

export function getPagamentoIdentifier(pagamento: IPagamento): number | undefined {
  return pagamento.id;
}
