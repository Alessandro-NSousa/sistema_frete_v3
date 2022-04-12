import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { ICaminhao, Caminhao } from '../caminhao.model';
import { CaminhaoService } from '../service/caminhao.service';

@Component({
  selector: 'jhi-caminhao-update',
  templateUrl: './caminhao-update.component.html',
})
export class CaminhaoUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    placa: [],
    ano: [],
    marca: [],
    carga: [],
  });

  constructor(protected caminhaoService: CaminhaoService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ caminhao }) => {
      this.updateForm(caminhao);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const caminhao = this.createFromForm();
    if (caminhao.id !== undefined) {
      this.subscribeToSaveResponse(this.caminhaoService.update(caminhao));
    } else {
      this.subscribeToSaveResponse(this.caminhaoService.create(caminhao));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICaminhao>>): void {
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

  protected updateForm(caminhao: ICaminhao): void {
    this.editForm.patchValue({
      id: caminhao.id,
      placa: caminhao.placa,
      ano: caminhao.ano,
      marca: caminhao.marca,
      carga: caminhao.carga,
    });
  }

  protected createFromForm(): ICaminhao {
    return {
      ...new Caminhao(),
      id: this.editForm.get(['id'])!.value,
      placa: this.editForm.get(['placa'])!.value,
      ano: this.editForm.get(['ano'])!.value,
      marca: this.editForm.get(['marca'])!.value,
      carga: this.editForm.get(['carga'])!.value,
    };
  }
}
