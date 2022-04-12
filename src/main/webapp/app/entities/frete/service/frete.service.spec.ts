import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import dayjs from 'dayjs/esm';

import { DATE_FORMAT } from 'app/config/input.constants';
import { IFrete, Frete } from '../frete.model';

import { FreteService } from './frete.service';

describe('Frete Service', () => {
  let service: FreteService;
  let httpMock: HttpTestingController;
  let elemDefault: IFrete;
  let expectedResult: IFrete | IFrete[] | boolean | null;
  let currentDate: dayjs.Dayjs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(FreteService);
    httpMock = TestBed.inject(HttpTestingController);
    currentDate = dayjs();

    elemDefault = {
      id: 0,
      data: currentDate,
      dias: 0,
      valor: 0,
      parcelamento: 0,
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign(
        {
          data: currentDate.format(DATE_FORMAT),
        },
        elemDefault
      );

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a Frete', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
          data: currentDate.format(DATE_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          data: currentDate,
        },
        returnedFromService
      );

      service.create(new Frete()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Frete', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          data: currentDate.format(DATE_FORMAT),
          dias: 1,
          valor: 1,
          parcelamento: 1,
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          data: currentDate,
        },
        returnedFromService
      );

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Frete', () => {
      const patchObject = Object.assign(
        {
          dias: 1,
          parcelamento: 1,
        },
        new Frete()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign(
        {
          data: currentDate,
        },
        returnedFromService
      );

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Frete', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          data: currentDate.format(DATE_FORMAT),
          dias: 1,
          valor: 1,
          parcelamento: 1,
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          data: currentDate,
        },
        returnedFromService
      );

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a Frete', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addFreteToCollectionIfMissing', () => {
      it('should add a Frete to an empty array', () => {
        const frete: IFrete = { id: 123 };
        expectedResult = service.addFreteToCollectionIfMissing([], frete);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(frete);
      });

      it('should not add a Frete to an array that contains it', () => {
        const frete: IFrete = { id: 123 };
        const freteCollection: IFrete[] = [
          {
            ...frete,
          },
          { id: 456 },
        ];
        expectedResult = service.addFreteToCollectionIfMissing(freteCollection, frete);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Frete to an array that doesn't contain it", () => {
        const frete: IFrete = { id: 123 };
        const freteCollection: IFrete[] = [{ id: 456 }];
        expectedResult = service.addFreteToCollectionIfMissing(freteCollection, frete);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(frete);
      });

      it('should add only unique Frete to an array', () => {
        const freteArray: IFrete[] = [{ id: 123 }, { id: 456 }, { id: 85024 }];
        const freteCollection: IFrete[] = [{ id: 123 }];
        expectedResult = service.addFreteToCollectionIfMissing(freteCollection, ...freteArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const frete: IFrete = { id: 123 };
        const frete2: IFrete = { id: 456 };
        expectedResult = service.addFreteToCollectionIfMissing([], frete, frete2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(frete);
        expect(expectedResult).toContain(frete2);
      });

      it('should accept null and undefined values', () => {
        const frete: IFrete = { id: 123 };
        expectedResult = service.addFreteToCollectionIfMissing([], null, frete, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(frete);
      });

      it('should return initial array if no Frete is added', () => {
        const freteCollection: IFrete[] = [{ id: 123 }];
        expectedResult = service.addFreteToCollectionIfMissing(freteCollection, undefined, null);
        expect(expectedResult).toEqual(freteCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
