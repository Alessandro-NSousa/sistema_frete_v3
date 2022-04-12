import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IFrete } from '../frete.model';
import { FreteService } from '../service/frete.service';
import { FreteDeleteDialogComponent } from '../delete/frete-delete-dialog.component';

@Component({
  selector: 'jhi-frete',
  templateUrl: './frete.component.html',
})
export class FreteComponent implements OnInit {
  fretes?: IFrete[];
  isLoading = false;

  constructor(protected freteService: FreteService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.freteService.query().subscribe({
      next: (res: HttpResponse<IFrete[]>) => {
        this.isLoading = false;
        this.fretes = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: IFrete): number {
    return item.id!;
  }

  delete(frete: IFrete): void {
    const modalRef = this.modalService.open(FreteDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.frete = frete;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
