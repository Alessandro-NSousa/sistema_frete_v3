import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IDespesa } from '../despesa.model';
import { DespesaService } from '../service/despesa.service';
import { DespesaDeleteDialogComponent } from '../delete/despesa-delete-dialog.component';

@Component({
  selector: 'jhi-despesa',
  templateUrl: './despesa.component.html',
})
export class DespesaComponent implements OnInit {
  despesas?: IDespesa[];
  isLoading = false;

  constructor(protected despesaService: DespesaService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.despesaService.query().subscribe({
      next: (res: HttpResponse<IDespesa[]>) => {
        this.isLoading = false;
        this.despesas = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: IDespesa): number {
    return item.id!;
  }

  delete(despesa: IDespesa): void {
    const modalRef = this.modalService.open(DespesaDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.despesa = despesa;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
