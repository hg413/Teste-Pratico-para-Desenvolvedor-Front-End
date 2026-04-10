import { Component, input } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [MatProgressSpinnerModule],
  template: `
    <div class="loading-container" [style.height]="height()">
      <mat-spinner diameter="50"></mat-spinner>
      <p>Carregando...</p>
    </div>
  `,
  styles: [`
    .loading-container {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 100%;
    }
    p { margin-top: 10px; color: #666; }
  `]
})
export class LoadingComponent {
  /**
   * Input para definir a altura do container de loading.
   */
  height = input<string>('200px');
}
