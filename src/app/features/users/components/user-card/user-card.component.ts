import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { User } from '../../../../core/models/user.model';

@Component({
  selector: 'app-user-card',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule],
  template: `
    <mat-card class="user-card">
      <mat-card-header>
        <div mat-card-avatar class="user-avatar">
          <mat-icon>person</mat-icon>
        </div>
        <mat-card-title>{{ user().name }}</mat-card-title>
        <mat-card-subtitle>{{ user().email }}</mat-card-subtitle>
      </mat-card-header>
      <mat-card-actions align="end">
        <button mat-icon-button color="warn" (click)="onDelete.emit(user())" title="Excluir Usuário">
          <mat-icon>delete</mat-icon>
        </button>
        <button mat-stroked-button color="primary" (click)="onEdit.emit(user())">
          <mat-icon>edit</mat-icon>
          EDITAR
        </button>
      </mat-card-actions>
    </mat-card>
  `,
  styles: [`
    .user-card {
      margin-bottom: 16px;
      transition: box-shadow 0.3s ease;
    }
    .user-card:hover {
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    }
    .user-avatar {
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #f5f5f5;
      border-radius: 50%;
    }
  `]
})
export class UserCardComponent {
  /**
   * Input de usuário usando o novo recurso 'input' (Signal-based) do Angular 17.
   */
  user = input.required<User>();

  /**
   * Evento disparado quando o botão de edição é clicado.
   */
  onEdit = output<User>();

  /**
   * Evento disparado quando o botão de exclusão é clicado.
   */
  onDelete = output<User>();
}
