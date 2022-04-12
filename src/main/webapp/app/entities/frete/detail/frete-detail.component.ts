import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IFrete } from '../frete.model';

@Component({
  selector: 'jhi-frete-detail',
  templateUrl: './frete-detail.component.html',
})
export class FreteDetailComponent implements OnInit {
  frete: IFrete | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ frete }) => {
      this.frete = frete;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
