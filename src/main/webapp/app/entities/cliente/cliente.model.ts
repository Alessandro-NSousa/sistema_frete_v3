import { IEndereco } from 'app/entities/endereco/endereco.model';
import { ICidade } from 'app/entities/cidade/cidade.model';

export interface ICliente {
  id?: number;
  nome?: string;
  telefone?: string | null;
  telefoneAdicional?: string | null;
  cnpj?: string | null;
  endereco?: IEndereco | null;
  cidade?: ICidade | null;
}

export class Cliente implements ICliente {
  constructor(
    public id?: number,
    public nome?: string,
    public telefone?: string | null,
    public telefoneAdicional?: string | null,
    public cnpj?: string | null,
    public endereco?: IEndereco | null,
    public cidade?: ICidade | null
  ) {}
}

export function getClienteIdentifier(cliente: ICliente): number | undefined {
  return cliente.id;
}
