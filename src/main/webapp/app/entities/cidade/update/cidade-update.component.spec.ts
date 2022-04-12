import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { CidadeService } from '../service/cidade.service';
import { ICidade, Cidade } from '../cidade.model';

import { CidadeUpdateComponent } from './cidade-update.component';

describe('Cidade Management Update Component', () => {
  let comp: CidadeUpdateComponent;
  let fixture: ComponentFixture<CidadeUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let cidadeService: CidadeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [CidadeUpdateComponent],
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
      .overrideTemplate(CidadeUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(CidadeUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    cidadeService = TestBed.inject(CidadeService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const cidade: ICidade = { id: 456 };

      activatedRoute.data = of({ cidade });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(cidade));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Cidade>>();
      const cidade = { id: 123 };
      jest.spyOn(cidadeService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ cidade });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: cidade }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(cidadeService.update).toHaveBeenCalledWith(cidade);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Cidade>>();
      const cidade = new Cidade();
      jest.spyOn(cidadeService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ cidade });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: cidade }));
      saveSubject.complete();

      // THEN
      expect(cidadeService.create).toHaveBeenCalledWith(cidade);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Cidade>>();
      const cidade = { id: 123 };
      jest.spyOn(cidadeService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ cidade });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(cidadeService.update).toHaveBeenCalledWith(cidade);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
