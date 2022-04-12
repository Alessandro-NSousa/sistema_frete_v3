import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IMotorista } from '../motorista.model';
import { MotoristaService } from '../service/motorista.service';
import { MotoristaDeleteDialogComponent } from '../delete/motorista-delete-dialog.component';

@Component({
  selector: 'jhi-motorista',
  templateUrl: './motorista.component.html',
})
export class MotoristaComponent implements OnInit {
  motoristas?: IMotorista[];
  isLoading = false;

  constructor(protected motoristaService: MotoristaService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.motoristaService.query().subscribe({
      next: (res: HttpResponse<IMotorista[]>) => {
        this.isLoading = false;
        this.motoristas = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: IMotorista): number {
    return item.id!;
  }

  delete(motorista: IMotorista): void {
    const modalRef = this.modalService.open(MotoristaDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.motorista = motorista;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
