import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { PagamentoService } from '../service/pagamento.service';
import { IPagamento, Pagamento } from '../pagamento.model';
import { IFrete } from 'app/entities/frete/frete.model';
import { FreteService } from 'app/entities/frete/service/frete.service';

import { PagamentoUpdateComponent } from './pagamento-update.component';

describe('Pagamento Management Update Component', () => {
  let comp: PagamentoUpdateComponent;
  let fixture: ComponentFixture<PagamentoUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let pagamentoService: PagamentoService;
  let freteService: FreteService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [PagamentoUpdateComponent],
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
      .overrideTemplate(PagamentoUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(PagamentoUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    pagamentoService = TestBed.inject(PagamentoService);
    freteService = TestBed.inject(FreteService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Frete query and add missing value', () => {
      const pagamento: IPagamento = { id: 456 };
      const frete: IFrete = { id: 60487 };
      pagamento.frete = frete;

      const freteCollection: IFrete[] = [{ id: 10851 }];
      jest.spyOn(freteService, 'query').mockReturnValue(of(new HttpResponse({ body: freteCollection })));
      const additionalFretes = [frete];
      const expectedCollection: IFrete[] = [...additionalFretes, ...freteCollection];
      jest.spyOn(freteService, 'addFreteToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ pagamento });
      comp.ngOnInit();

      expect(freteService.query).toHaveBeenCalled();
      expect(freteService.addFreteToCollectionIfMissing).toHaveBeenCalledWith(freteCollection, ...additionalFretes);
      expect(comp.fretesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const pagamento: IPagamento = { id: 456 };
      const frete: IFrete = { id: 91697 };
      pagamento.frete = frete;

      activatedRoute.data = of({ pagamento });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(pagamento));
      expect(comp.fretesSharedCollection).toContain(frete);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Pagamento>>();
      const pagamento = { id: 123 };
      jest.spyOn(pagamentoService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ pagamento });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: pagamento }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(pagamentoService.update).toHaveBeenCalledWith(pagamento);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Pagamento>>();
      const pagamento = new Pagamento();
      jest.spyOn(pagamentoService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ pagamento });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: pagamento }));
      saveSubject.complete();

      // THEN
      expect(pagamentoService.create).toHaveBeenCalledWith(pagamento);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Pagamento>>();
      const pagamento = { id: 123 };
      jest.spyOn(pagamentoService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ pagamento });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(pagamentoService.update).toHaveBeenCalledWith(pagamento);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackFreteById', () => {
      it('Should return tracked Frete primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackFreteById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
