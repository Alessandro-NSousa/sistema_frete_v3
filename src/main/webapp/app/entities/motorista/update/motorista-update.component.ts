import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IMotorista, Motorista } from '../motorista.model';
import { MotoristaService } from '../service/motorista.service';
import { IEndereco } from 'app/entities/endereco/endereco.model';
import { EnderecoService } from 'app/entities/endereco/service/endereco.service';
import { Sexo } from 'app/entities/enumerations/sexo.model';

@Component({
  selector: 'jhi-motorista-update',
  templateUrl: './motorista-update.component.html',
})
export class MotoristaUpdateComponent implements OnInit {
  isSaving = false;
  sexoValues = Object.keys(Sexo);

  enderecosCollection: IEndereco[] = [];

  editForm = this.fb.group({
    id: [],
    nome: [null, [Validators.required]],
    telefone: [],
    telefoneAdicional: [],
    cnh: [],
    sexo: [],
    endereco: [],
  });

  constructor(
    protected motoristaService: MotoristaService,
    protected enderecoService: EnderecoService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ motorista }) => {
      this.updateForm(motorista);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const motorista = this.createFromForm();
    if (motorista.id !== undefined) {
      this.subscribeToSaveResponse(this.motoristaService.update(motorista));
    } else {
      this.subscribeToSaveResponse(this.motoristaService.create(motorista));
    }
  }

  trackEnderecoById(_index: number, item: IEndereco): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IMotorista>>): void {
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

  protected updateForm(motorista: IMotorista): void {
    this.editForm.patchValue({
      id: motorista.id,
      nome: motorista.nome,
      telefone: motorista.telefone,
      telefoneAdicional: motorista.telefoneAdicional,
      cnh: motorista.cnh,
      sexo: motorista.sexo,
      endereco: motorista.endereco,
    });

    this.enderecosCollection = this.enderecoService.addEnderecoToCollectionIfMissing(this.enderecosCollection, motorista.endereco);
  }

  protected loadRelationshipsOptions(): void {
    this.enderecoService
      .query({ filter: 'motorista-is-null' })
      .pipe(map((res: HttpResponse<IEndereco[]>) => res.body ?? []))
      .pipe(
        map((enderecos: IEndereco[]) =>
          this.enderecoService.addEnderecoToCollectionIfMissing(enderecos, this.editForm.get('endereco')!.value)
        )
      )
      .subscribe((enderecos: IEndereco[]) => (this.enderecosCollection = enderecos));
  }

  protected createFromForm(): IMotorista {
    return {
      ...new Motorista(),
      id: this.editForm.get(['id'])!.value,
      nome: this.editForm.get(['nome'])!.value,
      telefone: this.editForm.get(['telefone'])!.value,
      telefoneAdicional: this.editForm.get(['telefoneAdicional'])!.value,
      cnh: this.editForm.get(['cnh'])!.value,
      sexo: this.editForm.get(['sexo'])!.value,
      endereco: this.editForm.get(['endereco'])!.value,
    };
  }
}
