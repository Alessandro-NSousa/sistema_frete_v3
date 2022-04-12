import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IMotorista, getMotoristaIdentifier } from '../motorista.model';

export type EntityResponseType = HttpResponse<IMotorista>;
export type EntityArrayResponseType = HttpResponse<IMotorista[]>;

@Injectable({ providedIn: 'root' })
export class MotoristaService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/motoristas');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(motorista: IMotorista): Observable<EntityResponseType> {
    return this.http.post<IMotorista>(this.resourceUrl, motorista, { observe: 'response' });
  }

  update(motorista: IMotorista): Observable<EntityResponseType> {
    return this.http.put<IMotorista>(`${this.resourceUrl}/${getMotoristaIdentifier(motorista) as number}`, motorista, {
      observe: 'response',
    });
  }

  partialUpdate(motorista: IMotorista): Observable<EntityResponseType> {
    return this.http.patch<IMotorista>(`${this.resourceUrl}/${getMotoristaIdentifier(motorista) as number}`, motorista, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IMotorista>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IMotorista[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addMotoristaToCollectionIfMissing(
    motoristaCollection: IMotorista[],
    ...motoristasToCheck: (IMotorista | null | undefined)[]
  ): IMotorista[] {
    const motoristas: IMotorista[] = motoristasToCheck.filter(isPresent);
    if (motoristas.length > 0) {
      const motoristaCollectionIdentifiers = motoristaCollection.map(motoristaItem => getMotoristaIdentifier(motoristaItem)!);
      const motoristasToAdd = motoristas.filter(motoristaItem => {
        const motoristaIdentifier = getMotoristaIdentifier(motoristaItem);
        if (motoristaIdentifier == null || motoristaCollectionIdentifiers.includes(motoristaIdentifier)) {
          return false;
        }
        motoristaCollectionIdentifiers.push(motoristaIdentifier);
        return true;
      });
      return [...motoristasToAdd, ...motoristaCollection];
    }
    return motoristaCollection;
  }
}
