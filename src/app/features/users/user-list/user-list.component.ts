import { Component, inject, Signal, computed, signal, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { UserService } from '../../../core/services/user.service';
import { User } from '../../../core/models/user.model';
import { UserCardComponent } from '../components/user-card/user-card.component';
import { UserFormComponent } from '../components/user-form/user-form.component';
import { LoadingComponent } from '../../../shared/components/loading/loading.component';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatDialogModule,
    MatSnackBarModule,
    UserCardComponent,
    LoadingComponent
  ],
  template: `
    <div class="list-page">
      <header class="header">
        <h1>Listagem de Usuários</h1>
        
        <mat-form-field appearance="outline" class="search-field">
          <mat-label>Pesquisar por nome</mat-label>
          <mat-icon matPrefix>search</mat-icon>
          <input matInput [formControl]="searchControl" placeholder="Ex: Bruno">
        </mat-form-field>
      </header>

      <!-- Feedback de erro -->
      <div *ngIf="error()" class="error-container">
        <mat-icon color="warn">error</mat-icon>
        <span>{{ error() }}</span>
        <button mat-button color="primary" (click)="retryLoad()">Tentar Novamente</button>
      </div>

      <!-- Feedback de loading -->
      <app-loading *ngIf="loading()" height="300px"></app-loading>

      <!-- Grid de usuários -->
      <div class="user-grid" *ngIf="!loading() && !error()">
        <app-user-card 
          *ngFor="let user of filteredUsers()" 
          [user]="user" 
          (onEdit)="openUserModal($event)"
          (onDelete)="deleteUser($event)">
        </app-user-card>
        
        <div *ngIf="filteredUsers().length === 0 && !loading()" class="empty-state">
           Nenhum usuário encontrado.
        </div>
      </div>

      <!-- Botão de adicionar usuário (FAB Vermelho) -->
      <button mat-fab color="warn" class="fab-btn" (click)="openUserModal()" aria-label="Adicionar usuário">
        <mat-icon>add</mat-icon>
      </button>
    </div>
  `,
  styles: [`
    .list-page {
      padding: 24px;
      max-width: 1200px;
      margin: 0 auto;
      position: relative;
      min-height: calc(100vh - 48px);
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 32px;
    }
    .search-field { width: 400px; }
    .user-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 24px;
    }
    .fab-btn {
      position: fixed;
      bottom: 32px;
      right: 32px;
    }
    .error-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
      padding: 64px;
      background: #fff1f0;
      border-radius: 8px;
    }
    .empty-state {
      grid-column: 1 / -1;
      text-align: center;
      padding: 48px;
      color: #777;
    }
    @media (max-width: 600px) {
      .header { flex-direction: column; align-items: stretch; gap: 16px; }
      .search-field { width: 100%; }
    }
  `]
})
export class UserListComponent {
  private userService = inject(UserService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);
  private destroyRef = inject(DestroyRef);

  // Seletores de Estado vindos do serviço
  loading = this.userService.loading;
  error = this.userService.error;
  
  // Controle de busca com Signal reativo para o filtro
  searchControl = new FormControl('');
  searchTerm = signal('');

  /**
   * Computed Signal que filtra a lista original sempre que searchTerm ou a lista de usuários muda.
   * Atende ao requisito de filtragem eficiente.
   */
  filteredUsers = computed(() => {
    const term = this.searchTerm().toLowerCase();
    const allUsers = this.userService.users();
    return allUsers.filter(u => u.name.toLowerCase().includes(term));
  });

  constructor() {
    /**
     * Requisito Técnico: Uso de Operadores RxJS (debounceTime e distinctUntilChanged).
     * Aplica o debounce de 300ms conforme solicitado no desafio.
     * O takeUntilDestroyed garante que não existam memory leaks.
     */
    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(value => {
      this.searchTerm.set(value || '');
    });
  }

  /**
   * Abre o modal para cadastrar ou editar um usuário.
   */
  openUserModal(user?: User): void {
    const dialogRef = this.dialog.open(UserFormComponent, {
      width: '450px',
      data: user,
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (user?.id) {
          this.updateUser(user.id, result);
        } else {
          this.createUser(result);
        }
      }
    });
  }

  retryLoad(): void {
    this.userService.loadUsers();
  }

  private createUser(userData: User): void {
    this.userService.addUser(userData).subscribe({
      next: () => this.snackBar.open('Usuário criado com sucesso!', 'Fechar', { duration: 3000 }),
      error: () => this.snackBar.open('Erro ao criar usuário.', 'Fechar', { duration: 3000 })
    });
  }

  private updateUser(id: string, userData: User): void {
    this.userService.updateUser(id, userData).subscribe({
      next: () => this.snackBar.open('Usuário atualizado com sucesso!', 'Fechar', { duration: 3000 }),
      error: () => this.snackBar.open('Erro ao atualizar usuário.', 'Fechar', { duration: 3000 })
    });
  }

  /**
   * Remove um usuário após confirmação simples.
   */
  deleteUser(user: User): void {
    if (user.id && confirm(`Tem certeza que deseja excluir o usuário ${user.name}?`)) {
      this.userService.deleteUser(user.id).subscribe({
        next: () => this.snackBar.open('Usuário removido com sucesso!', 'Fechar', { duration: 3000 }),
        error: () => this.snackBar.open('Erro ao remover usuário.', 'Fechar', { duration: 3000 })
      });
    }
  }
}
