import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IViagem } from '../viagem.model';
import { ViagemService } from '../service/viagem.service';
import { ViagemDeleteDialogComponent } from '../delete/viagem-delete-dialog.component';

@Component({
  selector: 'jhi-viagem',
  templateUrl: './viagem.component.html',
})
export class ViagemComponent implements OnInit {
  viagems?: IViagem[];
  isLoading = false;

  constructor(protected viagemService: ViagemService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.viagemService.query().subscribe({
      next: (res: HttpResponse<IViagem[]>) => {
        this.isLoading = false;
        this.viagems = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: IViagem): number {
    return item.id!;
  }

  delete(viagem: IViagem): void {
    const modalRef = this.modalService.open(ViagemDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.viagem = viagem;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
