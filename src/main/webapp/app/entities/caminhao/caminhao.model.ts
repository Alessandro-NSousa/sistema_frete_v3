export interface ICaminhao {
  id?: number;
  placa?: string | null;
  ano?: string | null;
  marca?: string | null;
  carga?: number | null;
}

export class Caminhao implements ICaminhao {
  constructor(
    public id?: number,
    public placa?: string | null,
    public ano?: string | null,
    public marca?: string | null,
    public carga?: number | null
  ) {}
}

export function getCaminhaoIdentifier(caminhao: ICaminhao): number | undefined {
  return caminhao.id;
}
