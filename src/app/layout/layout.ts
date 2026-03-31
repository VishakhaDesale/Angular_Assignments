import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar';
import { ThemeService } from '../services/theme.service';

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, SidebarComponent],
  templateUrl: './layout.html',
  styleUrl: './layout.scss'
})
export class LayoutComponent {
  sidebarOpen = signal(false);

  constructor(readonly themeService: ThemeService) {}

  toggle()     { this.sidebarOpen.update(v => !v); }
  close()      { this.sidebarOpen.set(false);       }
  toggleTheme() { this.themeService.toggleTheme();   }
}