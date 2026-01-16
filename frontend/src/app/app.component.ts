import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastContainerComponent } from './components/toast-container.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ToastContainerComponent], // Mantém o Toast global
  template: `
    <app-toast-container></app-toast-container>
    <router-outlet></router-outlet> `
})
export class AppComponent {}