import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

interface StatCard  { label: string; value: string; icon: string; color: string; }
interface FeatureCard { title: string; desc: string; icon: string; }

@Component({
  selector: 'app-overview',
  imports: [CommonModule],
  templateUrl: './overview.html',
  styleUrl: './overview.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OverviewComponent {
  readonly stats = signal<StatCard[]>([
    { label: 'Current Version', value: 'v20',         icon: 'bi-box',                color: '#6366f1' },
    { label: 'Initial Release',  value: '2016',        icon: 'bi-calendar3',          color: '#0ea5e9' },
    { label: 'Language',         value: 'TypeScript',  icon: 'bi-code-slash',         color: '#10b981' },
    { label: 'License',          value: 'MIT',         icon: 'bi-shield-check',       color: '#f59e0b' }
  ]);

  readonly features = signal<FeatureCard[]>([
    {
      title: 'Component Architecture',
      desc:  'Angular apps are built from reusable, self-contained components — each with its own template, styles, and logic.',
      icon:  'bi-puzzle'
    },
    {
      title: 'Powerful Routing',
      desc:  'The Angular Router enables SPA navigation with lazy loading, route guards, nested routes, and URL management.',
      icon:  'bi-signpost-split'
    },
    {
      title: 'Dependency Injection',
      desc:  'A built-in DI system decouples service creation from consumption, making code modular and testable.',
      icon:  'bi-diagram-3'
    },
    {
      title: 'Reactive with Signals',
      desc:  'Angular 16+ introduced Signals — a fine-grained reactivity model that eliminates unnecessary change detection.',
      icon:  'bi-lightning-charge'
    },
    {
      title: 'Angular CLI',
      desc:  'The CLI scaffolds, serves, builds, and tests your application with best-practice defaults out of the box.',
      icon:  'bi-terminal'
    },
    {
      title: 'Standalone Components',
      desc:  'Since Angular 19, standalone is default — no NgModules required, enabling simpler and leaner application structure.',
      icon:  'bi-boxes'
    }
  ]);
}