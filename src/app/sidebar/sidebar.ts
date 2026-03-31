import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

interface NavItem {
  label: string;
  route: string;
  icon: string;
}

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss'
})
export class SidebarComponent {
  isOpen = input<boolean>(false);
  closeSidebar = output<void>();

  private readonly navItemsSubject = new BehaviorSubject<NavItem[]>([
    { label: 'Overview',        route: '/overview',        icon: 'bi-grid-1x2' },
    { label: 'Version History', route: '/version-history', icon: 'bi-code-square' },
    { label: 'Core Concepts',   route: '/core-concepts',   icon: 'bi-lightbulb' }
  ]);
  readonly navItems$: Observable<NavItem[]> = this.navItemsSubject.asObservable();

  onNavClick() { this.closeSidebar.emit(); }
}