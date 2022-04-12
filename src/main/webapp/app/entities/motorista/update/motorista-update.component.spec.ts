import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { MotoristaService } from '../service/motorista.service';
import { IMotorista, Motorista } from '../motorista.model';
import { IEndereco } from 'app/entities/endereco/endereco.model';
import { EnderecoService } from 'app/entities/endereco/service/endereco.service';

import { MotoristaUpdateComponent } from './motorista-update.component';

describe('Motorista Management Update Component', () => {
  let comp: MotoristaUpdateComponent;
  let fixture: ComponentFixture<MotoristaUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let motoristaService: MotoristaService;
  let enderecoService: EnderecoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [MotoristaUpdateComponent],
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
      .overrideTemplate(MotoristaUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(MotoristaUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    motoristaService = TestBed.inject(MotoristaService);
    enderecoService = TestBed.inject(EnderecoService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call endereco query and add missing value', () => {
      const motorista: IMotorista = { id: 456 };
      const endereco: IEndereco = { id: 23553 };
      motorista.endereco = endereco;

      const enderecoCollection: IEndereco[] = [{ id: 76809 }];
      jest.spyOn(enderecoService, 'query').mockReturnValue(of(new HttpResponse({ body: enderecoCollection })));
      const expectedCollection: IEndereco[] = [endereco, ...enderecoCollection];
      jest.spyOn(enderecoService, 'addEnderecoToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ motorista });
      comp.ngOnInit();

      expect(enderecoService.query).toHaveBeenCalled();
      expect(enderecoService.addEnderecoToCollectionIfMissing).toHaveBeenCalledWith(enderecoCollection, endereco);
      expect(comp.enderecosCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const motorista: IMotorista = { id: 456 };
      const endereco: IEndereco = { id: 40042 };
      motorista.endereco = endereco;

      activatedRoute.data = of({ motorista });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(motorista));
      expect(comp.enderecosCollection).toContain(endereco);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Motorista>>();
      const motorista = { id: 123 };
      jest.spyOn(motoristaService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ motorista });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: motorista }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(motoristaService.update).toHaveBeenCalledWith(motorista);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Motorista>>();
      const motorista = new Motorista();
      jest.spyOn(motoristaService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ motorista });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: motorista }));
      saveSubject.complete();

      // THEN
      expect(motoristaService.create).toHaveBeenCalledWith(motorista);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Motorista>>();
      const motorista = { id: 123 };
      jest.spyOn(motoristaService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ motorista });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(motoristaService.update).toHaveBeenCalledWith(motorista);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackEnderecoById', () => {
      it('Should return tracked Endereco primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackEnderecoById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
