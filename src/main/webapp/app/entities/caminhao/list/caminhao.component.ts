import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ICaminhao } from '../caminhao.model';
import { CaminhaoService } from '../service/caminhao.service';
import { CaminhaoDeleteDialogComponent } from '../delete/caminhao-delete-dialog.component';

@Component({
  selector: 'jhi-caminhao',
  templateUrl: './caminhao.component.html',
})
export class CaminhaoComponent implements OnInit {
  caminhaos?: ICaminhao[];
  isLoading = false;

  constructor(protected caminhaoService: CaminhaoService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.caminhaoService.query().subscribe({
      next: (res: HttpResponse<ICaminhao[]>) => {
        this.isLoading = false;
        this.caminhaos = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: ICaminhao): number {
    return item.id!;
  }

  delete(caminhao: ICaminhao): void {
    const modalRef = this.modalService.open(CaminhaoDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.caminhao = caminhao;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
