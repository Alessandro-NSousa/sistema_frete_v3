import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { CaminhaoComponent } from './list/caminhao.component';
import { CaminhaoDetailComponent } from './detail/caminhao-detail.component';
import { CaminhaoUpdateComponent } from './update/caminhao-update.component';
import { CaminhaoDeleteDialogComponent } from './delete/caminhao-delete-dialog.component';
import { CaminhaoRoutingModule } from './route/caminhao-routing.module';

@NgModule({
  imports: [SharedModule, CaminhaoRoutingModule],
  declarations: [CaminhaoComponent, CaminhaoDetailComponent, CaminhaoUpdateComponent, CaminhaoDeleteDialogComponent],
  entryComponents: [CaminhaoDeleteDialogComponent],
})
export class CaminhaoModule {}
