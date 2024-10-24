import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterOutlet} from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  template: `
    <div class="wrapper">
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [`
    .wrapper {
      height: 100dvh;
      width: 100dvw;
    }
  `],
})
export class AppComponent {
  title = 'grid';
}
