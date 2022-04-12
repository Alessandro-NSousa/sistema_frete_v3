import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ICaminhao, Caminhao } from '../caminhao.model';

import { CaminhaoService } from './caminhao.service';

describe('Caminhao Service', () => {
  let service: CaminhaoService;
  let httpMock: HttpTestingController;
  let elemDefault: ICaminhao;
  let expectedResult: ICaminhao | ICaminhao[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(CaminhaoService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      placa: 'AAAAAAA',
      ano: 'AAAAAAA',
      marca: 'AAAAAAA',
      carga: 0,
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign({}, elemDefault);

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a Caminhao', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Caminhao()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Caminhao', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          placa: 'BBBBBB',
          ano: 'BBBBBB',
          marca: 'BBBBBB',
          carga: 1,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Caminhao', () => {
      const patchObject = Object.assign(
        {
          placa: 'BBBBBB',
          ano: 'BBBBBB',
          marca: 'BBBBBB',
        },
        new Caminhao()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Caminhao', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          placa: 'BBBBBB',
          ano: 'BBBBBB',
          marca: 'BBBBBB',
          carga: 1,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a Caminhao', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addCaminhaoToCollectionIfMissing', () => {
      it('should add a Caminhao to an empty array', () => {
        const caminhao: ICaminhao = { id: 123 };
        expectedResult = service.addCaminhaoToCollectionIfMissing([], caminhao);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(caminhao);
      });

      it('should not add a Caminhao to an array that contains it', () => {
        const caminhao: ICaminhao = { id: 123 };
        const caminhaoCollection: ICaminhao[] = [
          {
            ...caminhao,
          },
          { id: 456 },
        ];
        expectedResult = service.addCaminhaoToCollectionIfMissing(caminhaoCollection, caminhao);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Caminhao to an array that doesn't contain it", () => {
        const caminhao: ICaminhao = { id: 123 };
        const caminhaoCollection: ICaminhao[] = [{ id: 456 }];
        expectedResult = service.addCaminhaoToCollectionIfMissing(caminhaoCollection, caminhao);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(caminhao);
      });

      it('should add only unique Caminhao to an array', () => {
        const caminhaoArray: ICaminhao[] = [{ id: 123 }, { id: 456 }, { id: 17713 }];
        const caminhaoCollection: ICaminhao[] = [{ id: 123 }];
        expectedResult = service.addCaminhaoToCollectionIfMissing(caminhaoCollection, ...caminhaoArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const caminhao: ICaminhao = { id: 123 };
        const caminhao2: ICaminhao = { id: 456 };
        expectedResult = service.addCaminhaoToCollectionIfMissing([], caminhao, caminhao2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(caminhao);
        expect(expectedResult).toContain(caminhao2);
      });

      it('should accept null and undefined values', () => {
        const caminhao: ICaminhao = { id: 123 };
        expectedResult = service.addCaminhaoToCollectionIfMissing([], null, caminhao, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(caminhao);
      });

      it('should return initial array if no Caminhao is added', () => {
        const caminhaoCollection: ICaminhao[] = [{ id: 123 }];
        expectedResult = service.addCaminhaoToCollectionIfMissing(caminhaoCollection, undefined, null);
        expect(expectedResult).toEqual(caminhaoCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
