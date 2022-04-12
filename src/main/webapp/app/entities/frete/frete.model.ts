import dayjs from 'dayjs/esm';
import { ICidade } from 'app/entities/cidade/cidade.model';
import { ICliente } from 'app/entities/cliente/cliente.model';
import { IMotorista } from 'app/entities/motorista/motorista.model';
import { ICaminhao } from 'app/entities/caminhao/caminhao.model';

export interface IFrete {
  id?: number;
  data?: dayjs.Dayjs | null;
  dias?: number | null;
  valor?: number | null;
  parcelamento?: number | null;
  cidade?: ICidade | null;
  cliente?: ICliente | null;
  motorista?: IMotorista | null;
  caminhao?: ICaminhao | null;
}

export class Frete implements IFrete {
  constructor(
    public id?: number,
    public data?: dayjs.Dayjs | null,
    public dias?: number | null,
    public valor?: number | null,
    public parcelamento?: number | null,
    public cidade?: ICidade | null,
    public cliente?: ICliente | null,
    public motorista?: IMotorista | null,
    public caminhao?: ICaminhao | null
  ) {}
}

export function getFreteIdentifier(frete: IFrete): number | undefined {
  return frete.id;
}
