import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { CaminhaoDetailComponent } from './caminhao-detail.component';

describe('Caminhao Management Detail Component', () => {
  let comp: CaminhaoDetailComponent;
  let fixture: ComponentFixture<CaminhaoDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CaminhaoDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ caminhao: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(CaminhaoDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(CaminhaoDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load caminhao on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.caminhao).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
