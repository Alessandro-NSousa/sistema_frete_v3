export interface IDespesa {
  id?: number;
  descricao?: string;
}

export class Despesa implements IDespesa {
  constructor(public id?: number, public descricao?: string) {}
}

export function getDespesaIdentifier(despesa: IDespesa): number | undefined {
  return despesa.id;
}
