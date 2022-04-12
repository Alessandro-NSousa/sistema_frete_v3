import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IPagamento } from '../pagamento.model';
import { PagamentoService } from '../service/pagamento.service';

@Component({
  templateUrl: './pagamento-delete-dialog.component.html',
})
export class PagamentoDeleteDialogComponent {
  pagamento?: IPagamento;

  constructor(protected pagamentoService: PagamentoService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.pagamentoService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
