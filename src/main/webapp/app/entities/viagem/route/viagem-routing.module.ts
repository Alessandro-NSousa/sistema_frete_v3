import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ViagemComponent } from '../list/viagem.component';
import { ViagemDetailComponent } from '../detail/viagem-detail.component';
import { ViagemUpdateComponent } from '../update/viagem-update.component';
import { ViagemRoutingResolveService } from './viagem-routing-resolve.service';

const viagemRoute: Routes = [
  {
    path: '',
    component: ViagemComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ViagemDetailComponent,
    resolve: {
      viagem: ViagemRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ViagemUpdateComponent,
    resolve: {
      viagem: ViagemRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ViagemUpdateComponent,
    resolve: {
      viagem: ViagemRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(viagemRoute)],
  exports: [RouterModule],
})
export class ViagemRoutingModule {}
