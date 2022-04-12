import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { ViagemService } from '../service/viagem.service';

import { ViagemComponent } from './viagem.component';

describe('Viagem Management Component', () => {
  let comp: ViagemComponent;
  let fixture: ComponentFixture<ViagemComponent>;
  let service: ViagemService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ViagemComponent],
    })
      .overrideTemplate(ViagemComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ViagemComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(ViagemService);

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
    expect(comp.viagems?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
