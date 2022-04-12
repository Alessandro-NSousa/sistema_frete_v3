import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { MotoristaComponent } from '../list/motorista.component';
import { MotoristaDetailComponent } from '../detail/motorista-detail.component';
import { MotoristaUpdateComponent } from '../update/motorista-update.component';
import { MotoristaRoutingResolveService } from './motorista-routing-resolve.service';

const motoristaRoute: Routes = [
  {
    path: '',
    component: MotoristaComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: MotoristaDetailComponent,
    resolve: {
      motorista: MotoristaRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: MotoristaUpdateComponent,
    resolve: {
      motorista: MotoristaRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: MotoristaUpdateComponent,
    resolve: {
      motorista: MotoristaRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(motoristaRoute)],
  exports: [RouterModule],
})
export class MotoristaRoutingModule {}
