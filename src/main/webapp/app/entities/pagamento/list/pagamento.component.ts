import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IPagamento } from '../pagamento.model';
import { PagamentoService } from '../service/pagamento.service';
import { PagamentoDeleteDialogComponent } from '../delete/pagamento-delete-dialog.component';

@Component({
  selector: 'jhi-pagamento',
  templateUrl: './pagamento.component.html',
})
export class PagamentoComponent implements OnInit {
  pagamentos?: IPagamento[];
  isLoading = false;

  constructor(protected pagamentoService: PagamentoService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.pagamentoService.query().subscribe({
      next: (res: HttpResponse<IPagamento[]>) => {
        this.isLoading = false;
        this.pagamentos = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: IPagamento): number {
    return item.id!;
  }

  delete(pagamento: IPagamento): void {
    const modalRef = this.modalService.open(PagamentoDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.pagamento = pagamento;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
