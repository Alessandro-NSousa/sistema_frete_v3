import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { Sexo } from 'app/entities/enumerations/sexo.model';
import { IMotorista, Motorista } from '../motorista.model';

import { MotoristaService } from './motorista.service';

describe('Motorista Service', () => {
  let service: MotoristaService;
  let httpMock: HttpTestingController;
  let elemDefault: IMotorista;
  let expectedResult: IMotorista | IMotorista[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(MotoristaService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      nome: 'AAAAAAA',
      telefone: 'AAAAAAA',
      telefoneAdicional: 'AAAAAAA',
      cnh: 'AAAAAAA',
      sexo: Sexo.M,
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

    it('should create a Motorista', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Motorista()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Motorista', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          nome: 'BBBBBB',
          telefone: 'BBBBBB',
          telefoneAdicional: 'BBBBBB',
          cnh: 'BBBBBB',
          sexo: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Motorista', () => {
      const patchObject = Object.assign(
        {
          telefone: 'BBBBBB',
          sexo: 'BBBBBB',
        },
        new Motorista()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Motorista', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          nome: 'BBBBBB',
          telefone: 'BBBBBB',
          telefoneAdicional: 'BBBBBB',
          cnh: 'BBBBBB',
          sexo: 'BBBBBB',
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

    it('should delete a Motorista', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addMotoristaToCollectionIfMissing', () => {
      it('should add a Motorista to an empty array', () => {
        const motorista: IMotorista = { id: 123 };
        expectedResult = service.addMotoristaToCollectionIfMissing([], motorista);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(motorista);
      });

      it('should not add a Motorista to an array that contains it', () => {
        const motorista: IMotorista = { id: 123 };
        const motoristaCollection: IMotorista[] = [
          {
            ...motorista,
          },
          { id: 456 },
        ];
        expectedResult = service.addMotoristaToCollectionIfMissing(motoristaCollection, motorista);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Motorista to an array that doesn't contain it", () => {
        const motorista: IMotorista = { id: 123 };
        const motoristaCollection: IMotorista[] = [{ id: 456 }];
        expectedResult = service.addMotoristaToCollectionIfMissing(motoristaCollection, motorista);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(motorista);
      });

      it('should add only unique Motorista to an array', () => {
        const motoristaArray: IMotorista[] = [{ id: 123 }, { id: 456 }, { id: 73868 }];
        const motoristaCollection: IMotorista[] = [{ id: 123 }];
        expectedResult = service.addMotoristaToCollectionIfMissing(motoristaCollection, ...motoristaArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const motorista: IMotorista = { id: 123 };
        const motorista2: IMotorista = { id: 456 };
        expectedResult = service.addMotoristaToCollectionIfMissing([], motorista, motorista2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(motorista);
        expect(expectedResult).toContain(motorista2);
      });

      it('should accept null and undefined values', () => {
        const motorista: IMotorista = { id: 123 };
        expectedResult = service.addMotoristaToCollectionIfMissing([], null, motorista, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(motorista);
      });

      it('should return initial array if no Motorista is added', () => {
        const motoristaCollection: IMotorista[] = [{ id: 123 }];
        expectedResult = service.addMotoristaToCollectionIfMissing(motoristaCollection, undefined, null);
        expect(expectedResult).toEqual(motoristaCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
