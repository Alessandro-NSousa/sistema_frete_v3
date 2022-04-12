import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IDespesa, getDespesaIdentifier } from '../despesa.model';

export type EntityResponseType = HttpResponse<IDespesa>;
export type EntityArrayResponseType = HttpResponse<IDespesa[]>;

@Injectable({ providedIn: 'root' })
export class DespesaService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/despesas');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(despesa: IDespesa): Observable<EntityResponseType> {
    return this.http.post<IDespesa>(this.resourceUrl, despesa, { observe: 'response' });
  }

  update(despesa: IDespesa): Observable<EntityResponseType> {
    return this.http.put<IDespesa>(`${this.resourceUrl}/${getDespesaIdentifier(despesa) as number}`, despesa, { observe: 'response' });
  }

  partialUpdate(despesa: IDespesa): Observable<EntityResponseType> {
    return this.http.patch<IDespesa>(`${this.resourceUrl}/${getDespesaIdentifier(despesa) as number}`, despesa, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IDespesa>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IDespesa[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addDespesaToCollectionIfMissing(despesaCollection: IDespesa[], ...despesasToCheck: (IDespesa | null | undefined)[]): IDespesa[] {
    const despesas: IDespesa[] = despesasToCheck.filter(isPresent);
    if (despesas.length > 0) {
      const despesaCollectionIdentifiers = despesaCollection.map(despesaItem => getDespesaIdentifier(despesaItem)!);
      const despesasToAdd = despesas.filter(despesaItem => {
        const despesaIdentifier = getDespesaIdentifier(despesaItem);
        if (despesaIdentifier == null || despesaCollectionIdentifiers.includes(despesaIdentifier)) {
          return false;
        }
        despesaCollectionIdentifiers.push(despesaIdentifier);
        return true;
      });
      return [...despesasToAdd, ...despesaCollection];
    }
    return despesaCollection;
  }
}
