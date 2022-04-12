import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IFrete } from '../frete.model';
import { FreteService } from '../service/frete.service';

@Component({
  templateUrl: './frete-delete-dialog.component.html',
})
export class FreteDeleteDialogComponent {
  frete?: IFrete;

  constructor(protected freteService: FreteService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.freteService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
