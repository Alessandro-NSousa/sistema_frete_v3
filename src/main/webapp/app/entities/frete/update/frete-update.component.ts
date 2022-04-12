import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IFrete, Frete } from '../frete.model';
import { FreteService } from '../service/frete.service';
import { ICidade } from 'app/entities/cidade/cidade.model';
import { CidadeService } from 'app/entities/cidade/service/cidade.service';
import { ICliente } from 'app/entities/cliente/cliente.model';
import { ClienteService } from 'app/entities/cliente/service/cliente.service';
import { IMotorista } from 'app/entities/motorista/motorista.model';
import { MotoristaService } from 'app/entities/motorista/service/motorista.service';
import { ICaminhao } from 'app/entities/caminhao/caminhao.model';
import { CaminhaoService } from 'app/entities/caminhao/service/caminhao.service';

@Component({
  selector: 'jhi-frete-update',
  templateUrl: './frete-update.component.html',
})
export class FreteUpdateComponent implements OnInit {
  isSaving = false;

  cidadesSharedCollection: ICidade[] = [];
  clientesSharedCollection: ICliente[] = [];
  motoristasSharedCollection: IMotorista[] = [];
  caminhaosSharedCollection: ICaminhao[] = [];

  editForm = this.fb.group({
    id: [],
    data: [],
    dias: [],
    valor: [],
    parcelamento: [],
    cidade: [],
    cliente: [],
    motorista: [],
    caminhao: [],
  });

  constructor(
    protected freteService: FreteService,
    protected cidadeService: CidadeService,
    protected clienteService: ClienteService,
    protected motoristaService: MotoristaService,
    protected caminhaoService: CaminhaoService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ frete }) => {
      this.updateForm(frete);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const frete = this.createFromForm();
    if (frete.id !== undefined) {
      this.subscribeToSaveResponse(this.freteService.update(frete));
    } else {
      this.subscribeToSaveResponse(this.freteService.create(frete));
    }
  }

  trackCidadeById(_index: number, item: ICidade): number {
    return item.id!;
  }

  trackClienteById(_index: number, item: ICliente): number {
    return item.id!;
  }

  trackMotoristaById(_index: number, item: IMotorista): number {
    return item.id!;
  }

  trackCaminhaoById(_index: number, item: ICaminhao): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IFrete>>): void {
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

  protected updateForm(frete: IFrete): void {
    this.editForm.patchValue({
      id: frete.id,
      data: frete.data,
      dias: frete.dias,
      valor: frete.valor,
      parcelamento: frete.parcelamento,
      cidade: frete.cidade,
      cliente: frete.cliente,
      motorista: frete.motorista,
      caminhao: frete.caminhao,
    });

    this.cidadesSharedCollection = this.cidadeService.addCidadeToCollectionIfMissing(this.cidadesSharedCollection, frete.cidade);
    this.clientesSharedCollection = this.clienteService.addClienteToCollectionIfMissing(this.clientesSharedCollection, frete.cliente);
    this.motoristasSharedCollection = this.motoristaService.addMotoristaToCollectionIfMissing(
      this.motoristasSharedCollection,
      frete.motorista
    );
    this.caminhaosSharedCollection = this.caminhaoService.addCaminhaoToCollectionIfMissing(this.caminhaosSharedCollection, frete.caminhao);
  }

  protected loadRelationshipsOptions(): void {
    this.cidadeService
      .query()
      .pipe(map((res: HttpResponse<ICidade[]>) => res.body ?? []))
      .pipe(map((cidades: ICidade[]) => this.cidadeService.addCidadeToCollectionIfMissing(cidades, this.editForm.get('cidade')!.value)))
      .subscribe((cidades: ICidade[]) => (this.cidadesSharedCollection = cidades));

    this.clienteService
      .query()
      .pipe(map((res: HttpResponse<ICliente[]>) => res.body ?? []))
      .pipe(
        map((clientes: ICliente[]) => this.clienteService.addClienteToCollectionIfMissing(clientes, this.editForm.get('cliente')!.value))
      )
      .subscribe((clientes: ICliente[]) => (this.clientesSharedCollection = clientes));

    this.motoristaService
      .query()
      .pipe(map((res: HttpResponse<IMotorista[]>) => res.body ?? []))
      .pipe(
        map((motoristas: IMotorista[]) =>
          this.motoristaService.addMotoristaToCollectionIfMissing(motoristas, this.editForm.get('motorista')!.value)
        )
      )
      .subscribe((motoristas: IMotorista[]) => (this.motoristasSharedCollection = motoristas));

    this.caminhaoService
      .query()
      .pipe(map((res: HttpResponse<ICaminhao[]>) => res.body ?? []))
      .pipe(
        map((caminhaos: ICaminhao[]) =>
          this.caminhaoService.addCaminhaoToCollectionIfMissing(caminhaos, this.editForm.get('caminhao')!.value)
        )
      )
      .subscribe((caminhaos: ICaminhao[]) => (this.caminhaosSharedCollection = caminhaos));
  }

  protected createFromForm(): IFrete {
    return {
      ...new Frete(),
      id: this.editForm.get(['id'])!.value,
      data: this.editForm.get(['data'])!.value,
      dias: this.editForm.get(['dias'])!.value,
      valor: this.editForm.get(['valor'])!.value,
      parcelamento: this.editForm.get(['parcelamento'])!.value,
      cidade: this.editForm.get(['cidade'])!.value,
      cliente: this.editForm.get(['cliente'])!.value,
      motorista: this.editForm.get(['motorista'])!.value,
      caminhao: this.editForm.get(['caminhao'])!.value,
    };
  }
}
