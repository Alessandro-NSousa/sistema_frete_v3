import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { MotoristaComponent } from './list/motorista.component';
import { MotoristaDetailComponent } from './detail/motorista-detail.component';
import { MotoristaUpdateComponent } from './update/motorista-update.component';
import { MotoristaDeleteDialogComponent } from './delete/motorista-delete-dialog.component';
import { MotoristaRoutingModule } from './route/motorista-routing.module';

@NgModule({
  imports: [SharedModule, MotoristaRoutingModule],
  declarations: [MotoristaComponent, MotoristaDetailComponent, MotoristaUpdateComponent, MotoristaDeleteDialogComponent],
  entryComponents: [MotoristaDeleteDialogComponent],
})
export class MotoristaModule {}
