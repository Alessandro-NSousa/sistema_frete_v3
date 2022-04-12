import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IViagem } from '../viagem.model';
import { ViagemService } from '../service/viagem.service';

@Component({
  templateUrl: './viagem-delete-dialog.component.html',
})
export class ViagemDeleteDialogComponent {
  viagem?: IViagem;

  constructor(protected viagemService: ViagemService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.viagemService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
