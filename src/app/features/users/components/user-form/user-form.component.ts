import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { User } from '../../../../core/models/user.model';
import { CustomValidators } from '../../../../shared/validators/custom-validators';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    MatDialogModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatSelectModule, 
    MatButtonModule
  ],
  template: `
    <h2 mat-dialog-title>{{ isEdit ? 'Editar Usuário' : 'Novo Usuário' }}</h2>
    <mat-dialog-content>
      <form [formGroup]="userForm" class="form-container">
        <mat-form-field appearance="outline">
          <mat-label>Nome Completo</mat-label>
          <input matInput formControlName="name" placeholder="Ex: João Silva">
          <mat-error *ngIf="userForm.get('name')?.hasError('required')">Nome é obrigatório</mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>E-mail</mat-label>
          <input matInput formControlName="email" type="email" placeholder="Ex: joao.silva@email.com">
          <mat-error *ngIf="userForm.get('email')?.hasError('required')">E-mail é obrigatório</mat-error>
          <mat-error *ngIf="userForm.get('email')?.hasError('email')">E-mail inválido</mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>CPF</mat-label>
          <input matInput formControlName="cpf" placeholder="Ex: 000.000.000-00">
          <mat-error *ngIf="userForm.get('cpf')?.hasError('required')">CPF é obrigatório</mat-error>
          <mat-error *ngIf="userForm.get('cpf')?.hasError('cpfInvalid')">CPF inválido</mat-error>
        </mat-form-field>

        <div class="phone-group">
          <mat-form-field appearance="outline" class="phone-input">
            <mat-label>Telefone</mat-label>
            <input matInput formControlName="phone" placeholder="Ex: (00) 00000-0000">
            <mat-error *ngIf="userForm.get('phone')?.hasError('required')">Telefone é obrigatório</mat-error>
            <mat-error *ngIf="userForm.get('phone')?.hasError('phoneInvalid')">Telefone inválido</mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" class="phone-type">
            <mat-label>Tipo</mat-label>
            <mat-select formControlName="phoneType">
              <mat-option value="Mobile">Celular</mat-option>
              <mat-option value="Home">Residencial</mat-option>
              <mat-option value="Work">Trabalho</mat-option>
            </mat-select>
          </mat-form-field>
        </div>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancelar</button>
      <button mat-raised-button color="primary" [disabled]="userForm.invalid" (click)="onSave()">
        {{ isEdit ? 'Salvar Alterações' : 'Cadastrar' }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .form-container {
      display: flex;
      flex-direction: column;
      gap: 8px;
      min-width: 400px;
      padding-top: 10px;
    }
    .phone-group {
      display: flex;
      gap: 16px;
    }
    .phone-input { flex: 2; }
    .phone-type { flex: 1; }
  `]
})
export class UserFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<UserFormComponent>);
  public data = inject<User>(MAT_DIALOG_DATA);

  userForm: FormGroup;
  isEdit = false;

  constructor() {
    /**
     * Inicializa o formulário com as validações obrigatórias e customizadas.
     */
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      cpf: ['', [Validators.required, CustomValidators.cpf()]], // Validador de CPF customizado
      phone: ['', [Validators.required, CustomValidators.phone()]], // Validador de telefone customizado
      phoneType: ['Mobile', Validators.required]
    });
  }

  ngOnInit(): void {
    /**
     * Se houver dados passados para o modal, significa que estamos em modo de edição.
     * O formulário é preenchido automaticamente com patchValue.
     */
    if (this.data) {
      this.isEdit = true;
      this.userForm.patchValue(this.data);
    }
  }

  /**
   * Envia os dados do formulário de volta para quem abriu o modal se o formulário for válido.
   */
  onSave(): void {
    if (this.userForm.valid) {
      this.dialogRef.close(this.userForm.value);
    }
  }

  /**
   * Fecha o modal sem salvar.
   */
  onCancel(): void {
    this.dialogRef.close();
  }
}
