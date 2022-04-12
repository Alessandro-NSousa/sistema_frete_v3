import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ICaminhao } from '../caminhao.model';
import { CaminhaoService } from '../service/caminhao.service';

@Component({
  templateUrl: './caminhao-delete-dialog.component.html',
})
export class CaminhaoDeleteDialogComponent {
  caminhao?: ICaminhao;

  constructor(protected caminhaoService: CaminhaoService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.caminhaoService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
