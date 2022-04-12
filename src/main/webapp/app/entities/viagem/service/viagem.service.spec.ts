import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IViagem, Viagem } from '../viagem.model';

import { ViagemService } from './viagem.service';

describe('Viagem Service', () => {
  let service: ViagemService;
  let httpMock: HttpTestingController;
  let elemDefault: IViagem;
  let expectedResult: IViagem | IViagem[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ViagemService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      valorDespesa: 0,
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

    it('should create a Viagem', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Viagem()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Viagem', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          valorDespesa: 1,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Viagem', () => {
      const patchObject = Object.assign(
        {
          valorDespesa: 1,
        },
        new Viagem()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Viagem', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          valorDespesa: 1,
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

    it('should delete a Viagem', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addViagemToCollectionIfMissing', () => {
      it('should add a Viagem to an empty array', () => {
        const viagem: IViagem = { id: 123 };
        expectedResult = service.addViagemToCollectionIfMissing([], viagem);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(viagem);
      });

      it('should not add a Viagem to an array that contains it', () => {
        const viagem: IViagem = { id: 123 };
        const viagemCollection: IViagem[] = [
          {
            ...viagem,
          },
          { id: 456 },
        ];
        expectedResult = service.addViagemToCollectionIfMissing(viagemCollection, viagem);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Viagem to an array that doesn't contain it", () => {
        const viagem: IViagem = { id: 123 };
        const viagemCollection: IViagem[] = [{ id: 456 }];
        expectedResult = service.addViagemToCollectionIfMissing(viagemCollection, viagem);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(viagem);
      });

      it('should add only unique Viagem to an array', () => {
        const viagemArray: IViagem[] = [{ id: 123 }, { id: 456 }, { id: 77110 }];
        const viagemCollection: IViagem[] = [{ id: 123 }];
        expectedResult = service.addViagemToCollectionIfMissing(viagemCollection, ...viagemArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const viagem: IViagem = { id: 123 };
        const viagem2: IViagem = { id: 456 };
        expectedResult = service.addViagemToCollectionIfMissing([], viagem, viagem2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(viagem);
        expect(expectedResult).toContain(viagem2);
      });

      it('should accept null and undefined values', () => {
        const viagem: IViagem = { id: 123 };
        expectedResult = service.addViagemToCollectionIfMissing([], null, viagem, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(viagem);
      });

      it('should return initial array if no Viagem is added', () => {
        const viagemCollection: IViagem[] = [{ id: 123 }];
        expectedResult = service.addViagemToCollectionIfMissing(viagemCollection, undefined, null);
        expect(expectedResult).toEqual(viagemCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
