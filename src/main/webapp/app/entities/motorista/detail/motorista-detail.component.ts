import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IMotorista } from '../motorista.model';

@Component({
  selector: 'jhi-motorista-detail',
  templateUrl: './motorista-detail.component.html',
})
export class MotoristaDetailComponent implements OnInit {
  motorista: IMotorista | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ motorista }) => {
      this.motorista = motorista;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
