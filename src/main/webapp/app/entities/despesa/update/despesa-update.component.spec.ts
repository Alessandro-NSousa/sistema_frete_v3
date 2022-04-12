import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { DespesaService } from '../service/despesa.service';
import { IDespesa, Despesa } from '../despesa.model';

import { DespesaUpdateComponent } from './despesa-update.component';

describe('Despesa Management Update Component', () => {
  let comp: DespesaUpdateComponent;
  let fixture: ComponentFixture<DespesaUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let despesaService: DespesaService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [DespesaUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(DespesaUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(DespesaUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    despesaService = TestBed.inject(DespesaService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const despesa: IDespesa = { id: 456 };

      activatedRoute.data = of({ despesa });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(despesa));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Despesa>>();
      const despesa = { id: 123 };
      jest.spyOn(despesaService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ despesa });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: despesa }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(despesaService.update).toHaveBeenCalledWith(despesa);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Despesa>>();
      const despesa = new Despesa();
      jest.spyOn(despesaService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ despesa });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: despesa }));
      saveSubject.complete();

      // THEN
      expect(despesaService.create).toHaveBeenCalledWith(despesa);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Despesa>>();
      const despesa = { id: 123 };
      jest.spyOn(despesaService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ despesa });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(despesaService.update).toHaveBeenCalledWith(despesa);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
