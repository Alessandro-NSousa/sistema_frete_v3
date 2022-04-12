import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ICaminhao, Caminhao } from '../caminhao.model';
import { CaminhaoService } from '../service/caminhao.service';

@Injectable({ providedIn: 'root' })
export class CaminhaoRoutingResolveService implements Resolve<ICaminhao> {
  constructor(protected service: CaminhaoService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ICaminhao> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((caminhao: HttpResponse<Caminhao>) => {
          if (caminhao.body) {
            return of(caminhao.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Caminhao());
  }
}
