import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IMotorista } from '../motorista.model';
import { MotoristaService } from '../service/motorista.service';

@Component({
  templateUrl: './motorista-delete-dialog.component.html',
})
export class MotoristaDeleteDialogComponent {
  motorista?: IMotorista;

  constructor(protected motoristaService: MotoristaService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.motoristaService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
