import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ViagemService } from '../service/viagem.service';
import { IViagem, Viagem } from '../viagem.model';
import { IFrete } from 'app/entities/frete/frete.model';
import { FreteService } from 'app/entities/frete/service/frete.service';
import { IDespesa } from 'app/entities/despesa/despesa.model';
import { DespesaService } from 'app/entities/despesa/service/despesa.service';

import { ViagemUpdateComponent } from './viagem-update.component';

describe('Viagem Management Update Component', () => {
  let comp: ViagemUpdateComponent;
  let fixture: ComponentFixture<ViagemUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let viagemService: ViagemService;
  let freteService: FreteService;
  let despesaService: DespesaService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [ViagemUpdateComponent],
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
      .overrideTemplate(ViagemUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ViagemUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    viagemService = TestBed.inject(ViagemService);
    freteService = TestBed.inject(FreteService);
    despesaService = TestBed.inject(DespesaService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Frete query and add missing value', () => {
      const viagem: IViagem = { id: 456 };
      const frete: IFrete = { id: 46095 };
      viagem.frete = frete;

      const freteCollection: IFrete[] = [{ id: 98120 }];
      jest.spyOn(freteService, 'query').mockReturnValue(of(new HttpResponse({ body: freteCollection })));
      const additionalFretes = [frete];
      const expectedCollection: IFrete[] = [...additionalFretes, ...freteCollection];
      jest.spyOn(freteService, 'addFreteToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ viagem });
      comp.ngOnInit();

      expect(freteService.query).toHaveBeenCalled();
      expect(freteService.addFreteToCollectionIfMissing).toHaveBeenCalledWith(freteCollection, ...additionalFretes);
      expect(comp.fretesSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Despesa query and add missing value', () => {
      const viagem: IViagem = { id: 456 };
      const dispesa: IDespesa = { id: 82465 };
      viagem.dispesa = dispesa;

      const despesaCollection: IDespesa[] = [{ id: 47944 }];
      jest.spyOn(despesaService, 'query').mockReturnValue(of(new HttpResponse({ body: despesaCollection })));
      const additionalDespesas = [dispesa];
      const expectedCollection: IDespesa[] = [...additionalDespesas, ...despesaCollection];
      jest.spyOn(despesaService, 'addDespesaToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ viagem });
      comp.ngOnInit();

      expect(despesaService.query).toHaveBeenCalled();
      expect(despesaService.addDespesaToCollectionIfMissing).toHaveBeenCalledWith(despesaCollection, ...additionalDespesas);
      expect(comp.despesasSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const viagem: IViagem = { id: 456 };
      const frete: IFrete = { id: 8471 };
      viagem.frete = frete;
      const dispesa: IDespesa = { id: 53541 };
      viagem.dispesa = dispesa;

      activatedRoute.data = of({ viagem });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(viagem));
      expect(comp.fretesSharedCollection).toContain(frete);
      expect(comp.despesasSharedCollection).toContain(dispesa);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Viagem>>();
      const viagem = { id: 123 };
      jest.spyOn(viagemService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ viagem });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: viagem }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(viagemService.update).toHaveBeenCalledWith(viagem);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Viagem>>();
      const viagem = new Viagem();
      jest.spyOn(viagemService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ viagem });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: viagem }));
      saveSubject.complete();

      // THEN
      expect(viagemService.create).toHaveBeenCalledWith(viagem);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Viagem>>();
      const viagem = { id: 123 };
      jest.spyOn(viagemService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ viagem });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(viagemService.update).toHaveBeenCalledWith(viagem);
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

    describe('trackDespesaById', () => {
      it('Should return tracked Despesa primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackDespesaById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
