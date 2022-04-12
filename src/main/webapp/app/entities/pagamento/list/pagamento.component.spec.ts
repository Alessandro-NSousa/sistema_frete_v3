import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { PagamentoService } from '../service/pagamento.service';

import { PagamentoComponent } from './pagamento.component';

describe('Pagamento Management Component', () => {
  let comp: PagamentoComponent;
  let fixture: ComponentFixture<PagamentoComponent>;
  let service: PagamentoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [PagamentoComponent],
    })
      .overrideTemplate(PagamentoComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(PagamentoComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(PagamentoService);

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
    expect(comp.pagamentos?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
