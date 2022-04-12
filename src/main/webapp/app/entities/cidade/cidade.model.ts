import { ICliente } from 'app/entities/cliente/cliente.model';

export interface ICidade {
  id?: number;
  nome?: string;
  uf?: string | null;
  clientes?: ICliente[] | null;
}

export class Cidade implements ICidade {
  constructor(public id?: number, public nome?: string, public uf?: string | null, public clientes?: ICliente[] | null) {}
}

export function getCidadeIdentifier(cidade: ICidade): number | undefined {
  return cidade.id;
}
