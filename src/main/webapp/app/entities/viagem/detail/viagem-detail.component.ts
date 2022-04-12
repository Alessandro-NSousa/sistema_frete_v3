import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IViagem } from '../viagem.model';

@Component({
  selector: 'jhi-viagem-detail',
  templateUrl: './viagem-detail.component.html',
})
export class ViagemDetailComponent implements OnInit {
  viagem: IViagem | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ viagem }) => {
      this.viagem = viagem;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
