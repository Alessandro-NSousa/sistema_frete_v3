import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IPagamento, Pagamento } from '../pagamento.model';
import { PagamentoService } from '../service/pagamento.service';
import { IFrete } from 'app/entities/frete/frete.model';
import { FreteService } from 'app/entities/frete/service/frete.service';

@Component({
  selector: 'jhi-pagamento-update',
  templateUrl: './pagamento-update.component.html',
})
export class PagamentoUpdateComponent implements OnInit {
  isSaving = false;

  fretesSharedCollection: IFrete[] = [];

  editForm = this.fb.group({
    id: [],
    valor: [],
    parcela: [],
    formaPagamento: [],
    frete: [],
  });

  constructor(
    protected pagamentoService: PagamentoService,
    protected freteService: FreteService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ pagamento }) => {
      this.updateForm(pagamento);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const pagamento = this.createFromForm();
    if (pagamento.id !== undefined) {
      this.subscribeToSaveResponse(this.pagamentoService.update(pagamento));
    } else {
      this.subscribeToSaveResponse(this.pagamentoService.create(pagamento));
    }
  }

  trackFreteById(_index: number, item: IFrete): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPagamento>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(pagamento: IPagamento): void {
    this.editForm.patchValue({
      id: pagamento.id,
      valor: pagamento.valor,
      parcela: pagamento.parcela,
      formaPagamento: pagamento.formaPagamento,
      frete: pagamento.frete,
    });

    this.fretesSharedCollection = this.freteService.addFreteToCollectionIfMissing(this.fretesSharedCollection, pagamento.frete);
  }

  protected loadRelationshipsOptions(): void {
    this.freteService
      .query()
      .pipe(map((res: HttpResponse<IFrete[]>) => res.body ?? []))
      .pipe(map((fretes: IFrete[]) => this.freteService.addFreteToCollectionIfMissing(fretes, this.editForm.get('frete')!.value)))
      .subscribe((fretes: IFrete[]) => (this.fretesSharedCollection = fretes));
  }

  protected createFromForm(): IPagamento {
    return {
      ...new Pagamento(),
      id: this.editForm.get(['id'])!.value,
      valor: this.editForm.get(['valor'])!.value,
      parcela: this.editForm.get(['parcela'])!.value,
      formaPagamento: this.editForm.get(['formaPagamento'])!.value,
      frete: this.editForm.get(['frete'])!.value,
    };
  }
}
