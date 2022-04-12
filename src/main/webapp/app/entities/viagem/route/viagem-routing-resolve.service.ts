import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IViagem, Viagem } from '../viagem.model';
import { ViagemService } from '../service/viagem.service';

@Injectable({ providedIn: 'root' })
export class ViagemRoutingResolveService implements Resolve<IViagem> {
  constructor(protected service: ViagemService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IViagem> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((viagem: HttpResponse<Viagem>) => {
          if (viagem.body) {
            return of(viagem.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Viagem());
  }
}
