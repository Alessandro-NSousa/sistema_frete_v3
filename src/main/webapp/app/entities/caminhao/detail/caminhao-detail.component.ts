import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ICaminhao } from '../caminhao.model';

@Component({
  selector: 'jhi-caminhao-detail',
  templateUrl: './caminhao-detail.component.html',
})
export class CaminhaoDetailComponent implements OnInit {
  caminhao: ICaminhao | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ caminhao }) => {
      this.caminhao = caminhao;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
