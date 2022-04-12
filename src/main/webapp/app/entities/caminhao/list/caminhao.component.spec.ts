import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { CaminhaoService } from '../service/caminhao.service';

import { CaminhaoComponent } from './caminhao.component';

describe('Caminhao Management Component', () => {
  let comp: CaminhaoComponent;
  let fixture: ComponentFixture<CaminhaoComponent>;
  let service: CaminhaoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [CaminhaoComponent],
    })
      .overrideTemplate(CaminhaoComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(CaminhaoComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(CaminhaoService);

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
    expect(comp.caminhaos?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
