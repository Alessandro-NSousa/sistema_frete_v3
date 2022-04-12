import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IPagamento, getPagamentoIdentifier } from '../pagamento.model';

export type EntityResponseType = HttpResponse<IPagamento>;
export type EntityArrayResponseType = HttpResponse<IPagamento[]>;

@Injectable({ providedIn: 'root' })
export class PagamentoService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/pagamentos');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(pagamento: IPagamento): Observable<EntityResponseType> {
    return this.http.post<IPagamento>(this.resourceUrl, pagamento, { observe: 'response' });
  }

  update(pagamento: IPagamento): Observable<EntityResponseType> {
    return this.http.put<IPagamento>(`${this.resourceUrl}/${getPagamentoIdentifier(pagamento) as number}`, pagamento, {
      observe: 'response',
    });
  }

  partialUpdate(pagamento: IPagamento): Observable<EntityResponseType> {
    return this.http.patch<IPagamento>(`${this.resourceUrl}/${getPagamentoIdentifier(pagamento) as number}`, pagamento, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IPagamento>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IPagamento[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addPagamentoToCollectionIfMissing(
    pagamentoCollection: IPagamento[],
    ...pagamentosToCheck: (IPagamento | null | undefined)[]
  ): IPagamento[] {
    const pagamentos: IPagamento[] = pagamentosToCheck.filter(isPresent);
    if (pagamentos.length > 0) {
      const pagamentoCollectionIdentifiers = pagamentoCollection.map(pagamentoItem => getPagamentoIdentifier(pagamentoItem)!);
      const pagamentosToAdd = pagamentos.filter(pagamentoItem => {
        const pagamentoIdentifier = getPagamentoIdentifier(pagamentoItem);
        if (pagamentoIdentifier == null || pagamentoCollectionIdentifiers.includes(pagamentoIdentifier)) {
          return false;
        }
        pagamentoCollectionIdentifiers.push(pagamentoIdentifier);
        return true;
      });
      return [...pagamentosToAdd, ...pagamentoCollection];
    }
    return pagamentoCollection;
  }
}
