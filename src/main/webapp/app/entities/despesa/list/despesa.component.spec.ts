import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { DespesaService } from '../service/despesa.service';

import { DespesaComponent } from './despesa.component';

describe('Despesa Management Component', () => {
  let comp: DespesaComponent;
  let fixture: ComponentFixture<DespesaComponent>;
  let service: DespesaService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [DespesaComponent],
    })
      .overrideTemplate(DespesaComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(DespesaComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(DespesaService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        })
      )
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.despesas?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
