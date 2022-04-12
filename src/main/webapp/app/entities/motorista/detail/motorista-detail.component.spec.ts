import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { MotoristaDetailComponent } from './motorista-detail.component';

describe('Motorista Management Detail Component', () => {
  let comp: MotoristaDetailComponent;
  let fixture: ComponentFixture<MotoristaDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MotoristaDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ motorista: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(MotoristaDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(MotoristaDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load motorista on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.motorista).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
