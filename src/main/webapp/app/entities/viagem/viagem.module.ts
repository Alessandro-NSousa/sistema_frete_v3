import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ViagemComponent } from './list/viagem.component';
import { ViagemDetailComponent } from './detail/viagem-detail.component';
import { ViagemUpdateComponent } from './update/viagem-update.component';
import { ViagemDeleteDialogComponent } from './delete/viagem-delete-dialog.component';
import { ViagemRoutingModule } from './route/viagem-routing.module';

@NgModule({
  imports: [SharedModule, ViagemRoutingModule],
  declarations: [ViagemComponent, ViagemDetailComponent, ViagemUpdateComponent, ViagemDeleteDialogComponent],
  entryComponents: [ViagemDeleteDialogComponent],
})
export class ViagemModule {}
