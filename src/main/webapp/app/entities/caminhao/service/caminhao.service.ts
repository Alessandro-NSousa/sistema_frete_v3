import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ICaminhao, getCaminhaoIdentifier } from '../caminhao.model';

export type EntityResponseType = HttpResponse<ICaminhao>;
export type EntityArrayResponseType = HttpResponse<ICaminhao[]>;

@Injectable({ providedIn: 'root' })
export class CaminhaoService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/caminhaos');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(caminhao: ICaminhao): Observable<EntityResponseType> {
    return this.http.post<ICaminhao>(this.resourceUrl, caminhao, { observe: 'response' });
  }

  update(caminhao: ICaminhao): Observable<EntityResponseType> {
    return this.http.put<ICaminhao>(`${this.resourceUrl}/${getCaminhaoIdentifier(caminhao) as number}`, caminhao, { observe: 'response' });
  }

  partialUpdate(caminhao: ICaminhao): Observable<EntityResponseType> {
    return this.http.patch<ICaminhao>(`${this.resourceUrl}/${getCaminhaoIdentifier(caminhao) as number}`, caminhao, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ICaminhao>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ICaminhao[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addCaminhaoToCollectionIfMissing(caminhaoCollection: ICaminhao[], ...caminhaosToCheck: (ICaminhao | null | undefined)[]): ICaminhao[] {
    const caminhaos: ICaminhao[] = caminhaosToCheck.filter(isPresent);
    if (caminhaos.length > 0) {
      const caminhaoCollectionIdentifiers = caminhaoCollection.map(caminhaoItem => getCaminhaoIdentifier(caminhaoItem)!);
      const caminhaosToAdd = caminhaos.filter(caminhaoItem => {
        const caminhaoIdentifier = getCaminhaoIdentifier(caminhaoItem);
        if (caminhaoIdentifier == null || caminhaoCollectionIdentifiers.includes(caminhaoIdentifier)) {
          return false;
        }
        caminhaoCollectionIdentifiers.push(caminhaoIdentifier);
        return true;
      });
      return [...caminhaosToAdd, ...caminhaoCollection];
    }
    return caminhaoCollection;
  }
}
