import { FormControl } from '@angular/forms';
import { CustomValidators } from './custom-validators';
import { describe, it, expect } from 'vitest';

describe('CustomValidators', () => {
  describe('cpf', () => {
    it('deve retornar null para um CPF válido', () => {
      const control = new FormControl('12345678909');
      expect(CustomValidators.cpf()(control)).toBeNull();
    });

    it('deve retornar erro para um CPF com todos os dígitos iguais', () => {
      const control = new FormControl('11111111111');
      expect(CustomValidators.cpf()(control)).toEqual({ cpfInvalid: true });
    });

    it('deve retornar erro para um CPF com tamanho inválido', () => {
      const control = new FormControl('123');
      expect(CustomValidators.cpf()(control)).toEqual({ cpfInvalid: true });
    });
  });

  describe('phone', () => {
    it('deve retornar null para um telefone válido (11 dígitos)', () => {
      const control = new FormControl('11999998888');
      expect(CustomValidators.phone()(control)).toBeNull();
    });

    it('deve retornar null para um telefone válido (10 dígitos)', () => {
      const control = new FormControl('1133334444');
      expect(CustomValidators.phone()(control)).toBeNull();
    });

    it('deve retornar erro para um telefone com tamanho inválido', () => {
      const control = new FormControl('123456');
      expect(CustomValidators.phone()(control)).toEqual({ phoneInvalid: true });
    });
  });
});
