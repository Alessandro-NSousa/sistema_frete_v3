import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ICliente, Cliente } from '../cliente.model';
import { ClienteService } from '../service/cliente.service';
import { IEndereco } from 'app/entities/endereco/endereco.model';
import { EnderecoService } from 'app/entities/endereco/service/endereco.service';
import { ICidade } from 'app/entities/cidade/cidade.model';
import { CidadeService } from 'app/entities/cidade/service/cidade.service';

@Component({
  selector: 'jhi-cliente-update',
  templateUrl: './cliente-update.component.html',
})
export class ClienteUpdateComponent implements OnInit {
  isSaving = false;

  enderecosCollection: IEndereco[] = [];
  cidadesSharedCollection: ICidade[] = [];

  editForm = this.fb.group({
    id: [],
    nome: [null, [Validators.required]],
    telefone: [],
    telefoneAdicional: [],
    cnpj: [],
    endereco: [],
    cidade: [],
  });

  constructor(
    protected clienteService: ClienteService,
    protected enderecoService: EnderecoService,
    protected cidadeService: CidadeService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ cliente }) => {
      this.updateForm(cliente);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const cliente = this.createFromForm();
    if (cliente.id !== undefined) {
      this.subscribeToSaveResponse(this.clienteService.update(cliente));
    } else {
      this.subscribeToSaveResponse(this.clienteService.create(cliente));
    }
  }

  trackEnderecoById(_index: number, item: IEndereco): number {
    return item.id!;
  }

  trackCidadeById(_index: number, item: ICidade): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICliente>>): void {
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

  protected updateForm(cliente: ICliente): void {
    this.editForm.patchValue({
      id: cliente.id,
      nome: cliente.nome,
      telefone: cliente.telefone,
      telefoneAdicional: cliente.telefoneAdicional,
      cnpj: cliente.cnpj,
      endereco: cliente.endereco,
      cidade: cliente.cidade,
    });

    this.enderecosCollection = this.enderecoService.addEnderecoToCollectionIfMissing(this.enderecosCollection, cliente.endereco);
    this.cidadesSharedCollection = this.cidadeService.addCidadeToCollectionIfMissing(this.cidadesSharedCollection, cliente.cidade);
  }

  protected loadRelationshipsOptions(): void {
    this.enderecoService
      .query({ filter: 'cliente-is-null' })
      .pipe(map((res: HttpResponse<IEndereco[]>) => res.body ?? []))
      .pipe(
        map((enderecos: IEndereco[]) =>
          this.enderecoService.addEnderecoToCollectionIfMissing(enderecos, this.editForm.get('endereco')!.value)
        )
      )
      .subscribe((enderecos: IEndereco[]) => (this.enderecosCollection = enderecos));

    this.cidadeService
      .query()
      .pipe(map((res: HttpResponse<ICidade[]>) => res.body ?? []))
      .pipe(map((cidades: ICidade[]) => this.cidadeService.addCidadeToCollectionIfMissing(cidades, this.editForm.get('cidade')!.value)))
      .subscribe((cidades: ICidade[]) => (this.cidadesSharedCollection = cidades));
  }

  protected createFromForm(): ICliente {
    return {
      ...new Cliente(),
      id: this.editForm.get(['id'])!.value,
      nome: this.editForm.get(['nome'])!.value,
      telefone: this.editForm.get(['telefone'])!.value,
      telefoneAdicional: this.editForm.get(['telefoneAdicional'])!.value,
      cnpj: this.editForm.get(['cnpj'])!.value,
      endereco: this.editForm.get(['endereco'])!.value,
      cidade: this.editForm.get(['cidade'])!.value,
    };
  }
}
