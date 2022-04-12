import { IEndereco } from 'app/entities/endereco/endereco.model';
import { Sexo } from 'app/entities/enumerations/sexo.model';

export interface IMotorista {
  id?: number;
  nome?: string;
  telefone?: string | null;
  telefoneAdicional?: string | null;
  cnh?: string | null;
  sexo?: Sexo | null;
  endereco?: IEndereco | null;
}

export class Motorista implements IMotorista {
  constructor(
    public id?: number,
    public nome?: string,
    public telefone?: string | null,
    public telefoneAdicional?: string | null,
    public cnh?: string | null,
    public sexo?: Sexo | null,
    public endereco?: IEndereco | null
  ) {}
}

export function getMotoristaIdentifier(motorista: IMotorista): number | undefined {
  return motorista.id;
}
