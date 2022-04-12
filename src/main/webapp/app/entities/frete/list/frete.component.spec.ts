import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { FreteService } from '../service/frete.service';

import { FreteComponent } from './frete.component';

describe('Frete Management Component', () => {
  let comp: FreteComponent;
  let fixture: ComponentFixture<FreteComponent>;
  let service: FreteService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [FreteComponent],
    })
      .overrideTemplate(FreteComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(FreteComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(FreteService);

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
    expect(comp.fretes?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
