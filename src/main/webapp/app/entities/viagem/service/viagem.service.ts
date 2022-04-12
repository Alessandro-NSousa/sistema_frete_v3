import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IViagem, getViagemIdentifier } from '../viagem.model';

export type EntityResponseType = HttpResponse<IViagem>;
export type EntityArrayResponseType = HttpResponse<IViagem[]>;

@Injectable({ providedIn: 'root' })
export class ViagemService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/viagems');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(viagem: IViagem): Observable<EntityResponseType> {
    return this.http.post<IViagem>(this.resourceUrl, viagem, { observe: 'response' });
  }

  update(viagem: IViagem): Observable<EntityResponseType> {
    return this.http.put<IViagem>(`${this.resourceUrl}/${getViagemIdentifier(viagem) as number}`, viagem, { observe: 'response' });
  }

  partialUpdate(viagem: IViagem): Observable<EntityResponseType> {
    return this.http.patch<IViagem>(`${this.resourceUrl}/${getViagemIdentifier(viagem) as number}`, viagem, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IViagem>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IViagem[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addViagemToCollectionIfMissing(viagemCollection: IViagem[], ...viagemsToCheck: (IViagem | null | undefined)[]): IViagem[] {
    const viagems: IViagem[] = viagemsToCheck.filter(isPresent);
    if (viagems.length > 0) {
      const viagemCollectionIdentifiers = viagemCollection.map(viagemItem => getViagemIdentifier(viagemItem)!);
      const viagemsToAdd = viagems.filter(viagemItem => {
        const viagemIdentifier = getViagemIdentifier(viagemItem);
        if (viagemIdentifier == null || viagemCollectionIdentifiers.includes(viagemIdentifier)) {
          return false;
        }
        viagemCollectionIdentifiers.push(viagemIdentifier);
        return true;
      });
      return [...viagemsToAdd, ...viagemCollection];
    }
    return viagemCollection;
  }
}
