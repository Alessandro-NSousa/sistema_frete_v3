import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IFrete, Frete } from '../frete.model';
import { FreteService } from '../service/frete.service';

@Injectable({ providedIn: 'root' })
export class FreteRoutingResolveService implements Resolve<IFrete> {
  constructor(protected service: FreteService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IFrete> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((frete: HttpResponse<Frete>) => {
          if (frete.body) {
            return of(frete.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Frete());
  }
}
