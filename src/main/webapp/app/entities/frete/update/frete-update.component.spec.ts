import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { FreteService } from '../service/frete.service';
import { IFrete, Frete } from '../frete.model';
import { ICidade } from 'app/entities/cidade/cidade.model';
import { CidadeService } from 'app/entities/cidade/service/cidade.service';
import { ICliente } from 'app/entities/cliente/cliente.model';
import { ClienteService } from 'app/entities/cliente/service/cliente.service';
import { IMotorista } from 'app/entities/motorista/motorista.model';
import { MotoristaService } from 'app/entities/motorista/service/motorista.service';
import { ICaminhao } from 'app/entities/caminhao/caminhao.model';
import { CaminhaoService } from 'app/entities/caminhao/service/caminhao.service';

import { FreteUpdateComponent } from './frete-update.component';

describe('Frete Management Update Component', () => {
  let comp: FreteUpdateComponent;
  let fixture: ComponentFixture<FreteUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let freteService: FreteService;
  let cidadeService: CidadeService;
  let clienteService: ClienteService;
  let motoristaService: MotoristaService;
  let caminhaoService: CaminhaoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [FreteUpdateComponent],
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
      .overrideTemplate(FreteUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(FreteUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    freteService = TestBed.inject(FreteService);
    cidadeService = TestBed.inject(CidadeService);
    clienteService = TestBed.inject(ClienteService);
    motoristaService = TestBed.inject(MotoristaService);
    caminhaoService = TestBed.inject(CaminhaoService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Cidade query and add missing value', () => {
      const frete: IFrete = { id: 456 };
      const cidade: ICidade = { id: 61404 };
      frete.cidade = cidade;

      const cidadeCollection: ICidade[] = [{ id: 36541 }];
      jest.spyOn(cidadeService, 'query').mockReturnValue(of(new HttpResponse({ body: cidadeCollection })));
      const additionalCidades = [cidade];
      const expectedCollection: ICidade[] = [...additionalCidades, ...cidadeCollection];
      jest.spyOn(cidadeService, 'addCidadeToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ frete });
      comp.ngOnInit();

      expect(cidadeService.query).toHaveBeenCalled();
      expect(cidadeService.addCidadeToCollectionIfMissing).toHaveBeenCalledWith(cidadeCollection, ...additionalCidades);
      expect(comp.cidadesSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Cliente query and add missing value', () => {
      const frete: IFrete = { id: 456 };
      const cliente: ICliente = { id: 80726 };
      frete.cliente = cliente;

      const clienteCollection: ICliente[] = [{ id: 34042 }];
      jest.spyOn(clienteService, 'query').mockReturnValue(of(new HttpResponse({ body: clienteCollection })));
      const additionalClientes = [cliente];
      const expectedCollection: ICliente[] = [...additionalClientes, ...clienteCollection];
      jest.spyOn(clienteService, 'addClienteToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ frete });
      comp.ngOnInit();

      expect(clienteService.query).toHaveBeenCalled();
      expect(clienteService.addClienteToCollectionIfMissing).toHaveBeenCalledWith(clienteCollection, ...additionalClientes);
      expect(comp.clientesSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Motorista query and add missing value', () => {
      const frete: IFrete = { id: 456 };
      const motorista: IMotorista = { id: 5675 };
      frete.motorista = motorista;

      const motoristaCollection: IMotorista[] = [{ id: 30799 }];
      jest.spyOn(motoristaService, 'query').mockReturnValue(of(new HttpResponse({ body: motoristaCollection })));
      const additionalMotoristas = [motorista];
      const expectedCollection: IMotorista[] = [...additionalMotoristas, ...motoristaCollection];
      jest.spyOn(motoristaService, 'addMotoristaToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ frete });
      comp.ngOnInit();

      expect(motoristaService.query).toHaveBeenCalled();
      expect(motoristaService.addMotoristaToCollectionIfMissing).toHaveBeenCalledWith(motoristaCollection, ...additionalMotoristas);
      expect(comp.motoristasSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Caminhao query and add missing value', () => {
      const frete: IFrete = { id: 456 };
      const caminhao: ICaminhao = { id: 32406 };
      frete.caminhao = caminhao;

      const caminhaoCollection: ICaminhao[] = [{ id: 70526 }];
      jest.spyOn(caminhaoService, 'query').mockReturnValue(of(new HttpResponse({ body: caminhaoCollection })));
      const additionalCaminhaos = [caminhao];
      const expectedCollection: ICaminhao[] = [...additionalCaminhaos, ...caminhaoCollection];
      jest.spyOn(caminhaoService, 'addCaminhaoToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ frete });
      comp.ngOnInit();

      expect(caminhaoService.query).toHaveBeenCalled();
      expect(caminhaoService.addCaminhaoToCollectionIfMissing).toHaveBeenCalledWith(caminhaoCollection, ...additionalCaminhaos);
      expect(comp.caminhaosSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const frete: IFrete = { id: 456 };
      const cidade: ICidade = { id: 81282 };
      frete.cidade = cidade;
      const cliente: ICliente = { id: 21365 };
      frete.cliente = cliente;
      const motorista: IMotorista = { id: 57364 };
      frete.motorista = motorista;
      const caminhao: ICaminhao = { id: 19657 };
      frete.caminhao = caminhao;

      activatedRoute.data = of({ frete });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(frete));
      expect(comp.cidadesSharedCollection).toContain(cidade);
      expect(comp.clientesSharedCollection).toContain(cliente);
      expect(comp.motoristasSharedCollection).toContain(motorista);
      expect(comp.caminhaosSharedCollection).toContain(caminhao);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Frete>>();
      const frete = { id: 123 };
      jest.spyOn(freteService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ frete });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: frete }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(freteService.update).toHaveBeenCalledWith(frete);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Frete>>();
      const frete = new Frete();
      jest.spyOn(freteService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ frete });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: frete }));
      saveSubject.complete();

      // THEN
      expect(freteService.create).toHaveBeenCalledWith(frete);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Frete>>();
      const frete = { id: 123 };
      jest.spyOn(freteService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ frete });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(freteService.update).toHaveBeenCalledWith(frete);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackCidadeById', () => {
      it('Should return tracked Cidade primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackCidadeById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });

    describe('trackClienteById', () => {
      it('Should return tracked Cliente primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackClienteById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });

    describe('trackMotoristaById', () => {
      it('Should return tracked Motorista primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackMotoristaById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });

    describe('trackCaminhaoById', () => {
      it('Should return tracked Caminhao primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackCaminhaoById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
