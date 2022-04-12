import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { FreteComponent } from './list/frete.component';
import { FreteDetailComponent } from './detail/frete-detail.component';
import { FreteUpdateComponent } from './update/frete-update.component';
import { FreteDeleteDialogComponent } from './delete/frete-delete-dialog.component';
import { FreteRoutingModule } from './route/frete-routing.module';

@NgModule({
  imports: [SharedModule, FreteRoutingModule],
  declarations: [FreteComponent, FreteDetailComponent, FreteUpdateComponent, FreteDeleteDialogComponent],
  entryComponents: [FreteDeleteDialogComponent],
})
export class FreteModule {}
