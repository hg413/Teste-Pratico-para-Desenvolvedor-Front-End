import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Classe utilitária que contém validadores customizados para o desafio.
 */
export class CustomValidators {
  /**
   * Validador de CPF.
   * Verifica se o formato é válido e se os dígitos verificadores estão corretos.
   */
  static cpf(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const cpf = control.value?.replace(/\D/g, '');
      if (!cpf) return null;

      if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) {
        return { cpfInvalid: true };
      }

      let sum = 0;
      let remainder;

      for (let i = 1; i <= 9; i++) sum += parseInt(cpf.substring(i - 1, i)) * (11 - i);
      remainder = (sum * 10) % 11;
      if (remainder === 10 || remainder === 11) remainder = 0;
      if (remainder !== parseInt(cpf.substring(9, 10))) return { cpfInvalid: true };

      sum = 0;
      for (let i = 1; i <= 10; i++) sum += parseInt(cpf.substring(i - 1, i)) * (12 - i);
      remainder = (sum * 10) % 11;
      if (remainder === 10 || remainder === 11) remainder = 0;
      if (remainder !== parseInt(cpf.substring(10, 11))) return { cpfInvalid: true };

      return null;
    };
  }

  /**
   * Validador de Telefone.
   * Aceita formatos comuns brasileiros: (XX) XXXX-XXXX ou (XX) XXXXX-XXXX.
   */
  static phone(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const phone = control.value?.replace(/\D/g, '');
      if (!phone) return null;

      // Verifica se tem 10 ou 11 dígitos
      const valid = phone.length === 10 || phone.length === 11;
      return valid ? null : { phoneInvalid: true };
    };
  }
}
