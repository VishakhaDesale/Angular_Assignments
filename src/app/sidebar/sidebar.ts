import { Component, input, output, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

interface NavItem {
  label: string;
  route: string;
  icon: string;
}

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidebarComponent {
  isOpen = input<boolean>(false);
  closeSidebar = output<void>();

  readonly navItems = signal<NavItem[]>([
    { label: 'Overview',        route: '/overview',        icon: 'bi-grid-1x2'     },
    { label: 'Version History', route: '/version-history', icon: 'bi-code-square'  },
    { label: 'Core Concepts',   route: '/core-concepts',   icon: 'bi-lightbulb'    },
    { label: 'Movies',          route: '/movies',          icon: 'bi-camera-reels' },
  ]);

  /**
   * Emit close event when nav item is clicked
   */
  onNavClick(): void {
    this.closeSidebar.emit();
  }
}