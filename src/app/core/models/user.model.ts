/**
 * Interface que define a estrutura de um usuário no sistema.
 * Segue os requisitos do desafio: nome, e-mail, cpf e telefone.
 */
export interface User {
  id?: string;
  name: string;
  email: string;
  cpf: string;
  phone: string;
  phoneType: 'Mobile' | 'Home' | 'Work';
}

/**
 * Interface para o estado do repositório de usuários.
 * Utilizada para gerenciar loading e mensagens de erro.
 */
export interface UserState {
  users: User[];
  loading: boolean;
  error: string | null;
}
