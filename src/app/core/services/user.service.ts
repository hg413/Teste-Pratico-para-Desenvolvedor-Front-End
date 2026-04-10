import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { delay, of, Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { User, UserState } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  /**
   * Estado privado inicializado com Signals.
   * Centraliza a lista de usuários, o estado de carregamento e mensagens de erro.
   */
  private state = signal<UserState>({
    users: [],
    loading: false,
    error: null,
  });

  // Seletores públicos (Signals) para serem consumidos pelos componentes
  users = computed(() => this.state().users);
  loading = computed(() => this.state().loading);
  error = computed(() => this.state().error);

  /**
   * Lista mockada para simular um banco de dados.
   */
  private mockUsers: User[] = [
    { id: '1', name: 'Bruno Gonçalves', email: 'bruno@example.com', cpf: '123.456.789-00', phone: '(11) 98888-7777', phoneType: 'Mobile' },
    { id: '2', name: 'Ana Souza', email: 'ana.souza@example.com', cpf: '234.567.890-11', phone: '(21) 97777-6666', phoneType: 'Work' },
    { id: '3', name: 'Carlos Lima', email: 'c.lima@example.com', cpf: '345.678.901-22', phone: '(31) 96666-5555', phoneType: 'Home' },
  ];

  constructor() {
    // Carrega os dados iniciais ao instanciar o serviço
    this.loadUsers();
  }

  /**
   * Simula o carregamento de usuários da API.
   * Utiliza RxJS 'delay' para simular latência de rede e 'catchError' para tratamento de falhas.
   */
  loadUsers(): void {
    this.state.update(s => ({ ...s, loading: true, error: null }));

    of(this.mockUsers).pipe(
      delay(1000), // Simula um atraso de 1 segundo
      catchError(err => {
        this.state.update(s => ({ ...s, loading: false, error: 'Erro ao carregar usuários' }));
        return throwError(() => err);
      })
    ).subscribe(users => {
      this.state.update(s => ({ ...s, users, loading: false }));
    });
  }

  /**
   * Simula a criação de um novo usuário.
   * Gera um ID aleatório simples para fins de teste.
   */
  addUser(user: User): Observable<User> {
    const newUser = { ...user, id: Math.random().toString(36).substring(2) };
    
    // Simulação de delay para feedback visual de loading no botão
    return of(newUser).pipe(
      delay(500),
      tap(u => {
        this.mockUsers = [...this.mockUsers, u];
        this.state.update(s => ({ ...s, users: this.mockUsers }));
      })
    );
  }

  /**
   * Simula a edição de um usuário existente.
   */
  updateUser(id: string, userData: User): Observable<User> {
    return of(userData).pipe(
      delay(500),
      tap(u => {
        this.mockUsers = this.mockUsers.map(user => user.id === id ? { ...u, id } : user);
        this.state.update(s => ({ ...s, users: this.mockUsers }));
      })
    );
  }

  /**
   * Filtra usuários pelo nome (pesquisa local para o desafio).
   * Este método pode ser usado em conjunto com o template para exibir a lista filtrada.
   */
  filteredUsers(name: string): User[] {
    const term = name.toLowerCase();
    return this.state().users.filter(u => u.name.toLowerCase().includes(term));
  }

  /**
   * Simula a exclusão de um usuário.
   */
  deleteUser(id: string): Observable<void> {
    return of(void 0).pipe(
      delay(500),
      tap(() => {
        this.mockUsers = this.mockUsers.filter(user => user.id !== id);
        this.state.update(s => ({ ...s, users: this.mockUsers }));
      })
    );
  }
}
