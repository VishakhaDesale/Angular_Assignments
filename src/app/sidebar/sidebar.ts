import { Component, input, output, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

interface NavItem {
  label: string;
  route: string;
  icon: string;
}

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss'
})
export class SidebarComponent {
  isOpen = input<boolean>(false);
  closeSidebar = output<void>();

  readonly navItems = signal<NavItem[]>([
    { label: 'Overview',        route: '/overview',        icon: 'bi-grid-1x2' },
    { label: 'Version History', route: '/version-history', icon: 'bi-code-square' },
    { label: 'Core Concepts',   route: '/core-concepts',   icon: 'bi-lightbulb' }
  ]);

  onNavClick() { this.closeSidebar.emit(); }
}