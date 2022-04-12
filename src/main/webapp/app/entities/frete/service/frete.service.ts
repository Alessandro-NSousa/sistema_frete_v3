import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IFrete, getFreteIdentifier } from '../frete.model';

export type EntityResponseType = HttpResponse<IFrete>;
export type EntityArrayResponseType = HttpResponse<IFrete[]>;

@Injectable({ providedIn: 'root' })
export class FreteService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/fretes');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(frete: IFrete): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(frete);
    return this.http
      .post<IFrete>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(frete: IFrete): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(frete);
    return this.http
      .put<IFrete>(`${this.resourceUrl}/${getFreteIdentifier(frete) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(frete: IFrete): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(frete);
    return this.http
      .patch<IFrete>(`${this.resourceUrl}/${getFreteIdentifier(frete) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IFrete>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IFrete[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addFreteToCollectionIfMissing(freteCollection: IFrete[], ...fretesToCheck: (IFrete | null | undefined)[]): IFrete[] {
    const fretes: IFrete[] = fretesToCheck.filter(isPresent);
    if (fretes.length > 0) {
      const freteCollectionIdentifiers = freteCollection.map(freteItem => getFreteIdentifier(freteItem)!);
      const fretesToAdd = fretes.filter(freteItem => {
        const freteIdentifier = getFreteIdentifier(freteItem);
        if (freteIdentifier == null || freteCollectionIdentifiers.includes(freteIdentifier)) {
          return false;
        }
        freteCollectionIdentifiers.push(freteIdentifier);
        return true;
      });
      return [...fretesToAdd, ...freteCollection];
    }
    return freteCollection;
  }

  protected convertDateFromClient(frete: IFrete): IFrete {
    return Object.assign({}, frete, {
      data: frete.data?.isValid() ? frete.data.format(DATE_FORMAT) : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.data = res.body.data ? dayjs(res.body.data) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((frete: IFrete) => {
        frete.data = frete.data ? dayjs(frete.data) : undefined;
      });
    }
    return res;
  }
}
