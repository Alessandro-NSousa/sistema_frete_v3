import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ViagemDetailComponent } from './viagem-detail.component';

describe('Viagem Management Detail Component', () => {
  let comp: ViagemDetailComponent;
  let fixture: ComponentFixture<ViagemDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViagemDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ viagem: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(ViagemDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(ViagemDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load viagem on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.viagem).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
