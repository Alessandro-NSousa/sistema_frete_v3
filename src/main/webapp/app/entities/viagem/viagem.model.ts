import { IFrete } from 'app/entities/frete/frete.model';
import { IDespesa } from 'app/entities/despesa/despesa.model';

export interface IViagem {
  id?: number;
  valorDespesa?: number;
  frete?: IFrete | null;
  dispesa?: IDespesa | null;
}

export class Viagem implements IViagem {
  constructor(public id?: number, public valorDespesa?: number, public frete?: IFrete | null, public dispesa?: IDespesa | null) {}
}

export function getViagemIdentifier(viagem: IViagem): number | undefined {
  return viagem.id;
}
