import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { FreteDetailComponent } from './frete-detail.component';

describe('Frete Management Detail Component', () => {
  let comp: FreteDetailComponent;
  let fixture: ComponentFixture<FreteDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FreteDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ frete: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(FreteDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(FreteDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load frete on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.frete).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
