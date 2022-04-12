import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IViagem, Viagem } from '../viagem.model';
import { ViagemService } from '../service/viagem.service';
import { IFrete } from 'app/entities/frete/frete.model';
import { FreteService } from 'app/entities/frete/service/frete.service';
import { IDespesa } from 'app/entities/despesa/despesa.model';
import { DespesaService } from 'app/entities/despesa/service/despesa.service';

@Component({
  selector: 'jhi-viagem-update',
  templateUrl: './viagem-update.component.html',
})
export class ViagemUpdateComponent implements OnInit {
  isSaving = false;

  fretesSharedCollection: IFrete[] = [];
  despesasSharedCollection: IDespesa[] = [];

  editForm = this.fb.group({
    id: [],
    valorDespesa: [null, [Validators.required]],
    frete: [],
    dispesa: [],
  });

  constructor(
    protected viagemService: ViagemService,
    protected freteService: FreteService,
    protected despesaService: DespesaService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ viagem }) => {
      this.updateForm(viagem);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const viagem = this.createFromForm();
    if (viagem.id !== undefined) {
      this.subscribeToSaveResponse(this.viagemService.update(viagem));
    } else {
      this.subscribeToSaveResponse(this.viagemService.create(viagem));
    }
  }

  trackFreteById(_index: number, item: IFrete): number {
    return item.id!;
  }

  trackDespesaById(_index: number, item: IDespesa): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IViagem>>): void {
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

  protected updateForm(viagem: IViagem): void {
    this.editForm.patchValue({
      id: viagem.id,
      valorDespesa: viagem.valorDespesa,
      frete: viagem.frete,
      dispesa: viagem.dispesa,
    });

    this.fretesSharedCollection = this.freteService.addFreteToCollectionIfMissing(this.fretesSharedCollection, viagem.frete);
    this.despesasSharedCollection = this.despesaService.addDespesaToCollectionIfMissing(this.despesasSharedCollection, viagem.dispesa);
  }

  protected loadRelationshipsOptions(): void {
    this.freteService
      .query()
      .pipe(map((res: HttpResponse<IFrete[]>) => res.body ?? []))
      .pipe(map((fretes: IFrete[]) => this.freteService.addFreteToCollectionIfMissing(fretes, this.editForm.get('frete')!.value)))
      .subscribe((fretes: IFrete[]) => (this.fretesSharedCollection = fretes));

    this.despesaService
      .query()
      .pipe(map((res: HttpResponse<IDespesa[]>) => res.body ?? []))
      .pipe(
        map((despesas: IDespesa[]) => this.despesaService.addDespesaToCollectionIfMissing(despesas, this.editForm.get('dispesa')!.value))
      )
      .subscribe((despesas: IDespesa[]) => (this.despesasSharedCollection = despesas));
  }

  protected createFromForm(): IViagem {
    return {
      ...new Viagem(),
      id: this.editForm.get(['id'])!.value,
      valorDespesa: this.editForm.get(['valorDespesa'])!.value,
      frete: this.editForm.get(['frete'])!.value,
      dispesa: this.editForm.get(['dispesa'])!.value,
    };
  }
}
