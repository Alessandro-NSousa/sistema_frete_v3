import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { CaminhaoService } from '../service/caminhao.service';
import { ICaminhao, Caminhao } from '../caminhao.model';

import { CaminhaoUpdateComponent } from './caminhao-update.component';

describe('Caminhao Management Update Component', () => {
  let comp: CaminhaoUpdateComponent;
  let fixture: ComponentFixture<CaminhaoUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let caminhaoService: CaminhaoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [CaminhaoUpdateComponent],
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
      .overrideTemplate(CaminhaoUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(CaminhaoUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    caminhaoService = TestBed.inject(CaminhaoService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const caminhao: ICaminhao = { id: 456 };

      activatedRoute.data = of({ caminhao });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(caminhao));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Caminhao>>();
      const caminhao = { id: 123 };
      jest.spyOn(caminhaoService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ caminhao });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: caminhao }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(caminhaoService.update).toHaveBeenCalledWith(caminhao);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Caminhao>>();
      const caminhao = new Caminhao();
      jest.spyOn(caminhaoService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ caminhao });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: caminhao }));
      saveSubject.complete();

      // THEN
      expect(caminhaoService.create).toHaveBeenCalledWith(caminhao);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Caminhao>>();
      const caminhao = { id: 123 };
      jest.spyOn(caminhaoService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ caminhao });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(caminhaoService.update).toHaveBeenCalledWith(caminhao);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
