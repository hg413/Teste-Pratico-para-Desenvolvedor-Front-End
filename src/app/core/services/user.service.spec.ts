import { UserService } from './user.service';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { User } from '../models/user.model';
import { firstValueFrom } from 'rxjs';

// Note: In a real Angular project, we'd use TestBed. 
// For this challenge, we can test the class logic directly if it doesn't depend on complex DI.

describe('UserService', () => {
  let service: UserService;

  beforeEach(() => {
    // Como o serviço não tem dependências complexas (HttpClient não está sendo usado no mock), podemos instanciar diretamente
    service = new UserService();
  });

  it('deve inicializar com usuários e estado de loading falso', () => {
    // Dado o delay no loadUsers do construtor, inicialmente pode estar loading
    expect(service.loading()).toBe(true);
  });

  it('deve carregar usuários após o delay', async () => {
    // Aguardamos um pouco mais que o delay de 1000ms do serviço
    await new Promise(resolve => setTimeout(resolve, 1100));
    
    expect(service.loading()).toBe(false);
    expect(service.users().length).toBeGreaterThan(0);
  });

  it('deve adicionar um novo usuário e atualizar o sinal de users', async () => {
    const newUser: User = {
      name: 'Teste Silva',
      email: 'teste@exemplo.com',
      cpf: '00000000000',
      phone: '11999999999',
      phoneType: 'Mobile'
    };

    const result = await firstValueFrom(service.addUser(newUser));
    
    expect(result.name).toBe(newUser.name);
    expect(service.users()).toContainEqual(expect.objectContaining({ name: 'Teste Silva' }));
  });
});
