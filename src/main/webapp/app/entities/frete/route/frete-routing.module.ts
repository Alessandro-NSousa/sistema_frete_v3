import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { FreteComponent } from '../list/frete.component';
import { FreteDetailComponent } from '../detail/frete-detail.component';
import { FreteUpdateComponent } from '../update/frete-update.component';
import { FreteRoutingResolveService } from './frete-routing-resolve.service';

const freteRoute: Routes = [
  {
    path: '',
    component: FreteComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: FreteDetailComponent,
    resolve: {
      frete: FreteRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: FreteUpdateComponent,
    resolve: {
      frete: FreteRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: FreteUpdateComponent,
    resolve: {
      frete: FreteRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(freteRoute)],
  exports: [RouterModule],
})
export class FreteRoutingModule {}
