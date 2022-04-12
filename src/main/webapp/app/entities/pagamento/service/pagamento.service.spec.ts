import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IPagamento, Pagamento } from '../pagamento.model';

import { PagamentoService } from './pagamento.service';

describe('Pagamento Service', () => {
  let service: PagamentoService;
  let httpMock: HttpTestingController;
  let elemDefault: IPagamento;
  let expectedResult: IPagamento | IPagamento[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(PagamentoService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      valor: 0,
      parcela: 0,
      formaPagamento: 'AAAAAAA',
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

    it('should create a Pagamento', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Pagamento()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Pagamento', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          valor: 1,
          parcela: 1,
          formaPagamento: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Pagamento', () => {
      const patchObject = Object.assign(
        {
          valor: 1,
          parcela: 1,
          formaPagamento: 'BBBBBB',
        },
        new Pagamento()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Pagamento', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          valor: 1,
          parcela: 1,
          formaPagamento: 'BBBBBB',
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

    it('should delete a Pagamento', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addPagamentoToCollectionIfMissing', () => {
      it('should add a Pagamento to an empty array', () => {
        const pagamento: IPagamento = { id: 123 };
        expectedResult = service.addPagamentoToCollectionIfMissing([], pagamento);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(pagamento);
      });

      it('should not add a Pagamento to an array that contains it', () => {
        const pagamento: IPagamento = { id: 123 };
        const pagamentoCollection: IPagamento[] = [
          {
            ...pagamento,
          },
          { id: 456 },
        ];
        expectedResult = service.addPagamentoToCollectionIfMissing(pagamentoCollection, pagamento);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Pagamento to an array that doesn't contain it", () => {
        const pagamento: IPagamento = { id: 123 };
        const pagamentoCollection: IPagamento[] = [{ id: 456 }];
        expectedResult = service.addPagamentoToCollectionIfMissing(pagamentoCollection, pagamento);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(pagamento);
      });

      it('should add only unique Pagamento to an array', () => {
        const pagamentoArray: IPagamento[] = [{ id: 123 }, { id: 456 }, { id: 50906 }];
        const pagamentoCollection: IPagamento[] = [{ id: 123 }];
        expectedResult = service.addPagamentoToCollectionIfMissing(pagamentoCollection, ...pagamentoArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const pagamento: IPagamento = { id: 123 };
        const pagamento2: IPagamento = { id: 456 };
        expectedResult = service.addPagamentoToCollectionIfMissing([], pagamento, pagamento2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(pagamento);
        expect(expectedResult).toContain(pagamento2);
      });

      it('should accept null and undefined values', () => {
        const pagamento: IPagamento = { id: 123 };
        expectedResult = service.addPagamentoToCollectionIfMissing([], null, pagamento, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(pagamento);
      });

      it('should return initial array if no Pagamento is added', () => {
        const pagamentoCollection: IPagamento[] = [{ id: 123 }];
        expectedResult = service.addPagamentoToCollectionIfMissing(pagamentoCollection, undefined, null);
        expect(expectedResult).toEqual(pagamentoCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
