import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IDespesa, Despesa } from '../despesa.model';
import { DespesaService } from '../service/despesa.service';

@Component({
  selector: 'jhi-despesa-update',
  templateUrl: './despesa-update.component.html',
})
export class DespesaUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    descricao: [null, [Validators.required]],
  });

  constructor(protected despesaService: DespesaService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ despesa }) => {
      this.updateForm(despesa);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const despesa = this.createFromForm();
    if (despesa.id !== undefined) {
      this.subscribeToSaveResponse(this.despesaService.update(despesa));
    } else {
      this.subscribeToSaveResponse(this.despesaService.create(despesa));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IDespesa>>): void {
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

  protected updateForm(despesa: IDespesa): void {
    this.editForm.patchValue({
      id: despesa.id,
      descricao: despesa.descricao,
    });
  }

  protected createFromForm(): IDespesa {
    return {
      ...new Despesa(),
      id: this.editForm.get(['id'])!.value,
      descricao: this.editForm.get(['descricao'])!.value,
    };
  }
}
