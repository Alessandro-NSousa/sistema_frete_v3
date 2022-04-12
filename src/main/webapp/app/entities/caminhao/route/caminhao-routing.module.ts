import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { CaminhaoComponent } from '../list/caminhao.component';
import { CaminhaoDetailComponent } from '../detail/caminhao-detail.component';
import { CaminhaoUpdateComponent } from '../update/caminhao-update.component';
import { CaminhaoRoutingResolveService } from './caminhao-routing-resolve.service';

const caminhaoRoute: Routes = [
  {
    path: '',
    component: CaminhaoComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: CaminhaoDetailComponent,
    resolve: {
      caminhao: CaminhaoRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: CaminhaoUpdateComponent,
    resolve: {
      caminhao: CaminhaoRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: CaminhaoUpdateComponent,
    resolve: {
      caminhao: CaminhaoRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(caminhaoRoute)],
  exports: [RouterModule],
})
export class CaminhaoRoutingModule {}
