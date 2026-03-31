import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';

interface TopicCard {
  icon: string;
  category: string;
  title: string;
  desc: string;
  points: string[];
  important: string[];
  variant: 'purple' | 'blue' | 'amber' | 'green' | 'red';
}

@Component({
  selector: 'app-core-concepts',
  imports: [CommonModule],
  templateUrl: './core-concepts.html',
  styleUrl: './core-concepts.scss'
})
export class CoreConceptsComponent {

  private readonly topicsSubject = new BehaviorSubject<TopicCard[]>([
    {
      icon: 'bi-diagram-3',
      category: 'Architecture',
      title: 'Dependency Injection',
      desc: 'Angular uses a hierarchical DI system to manage service instances efficiently, enabling better memory control, isolation, and reusability across the application.',
      points: [
        'Root level: singleton across the entire app',
        'Module level: shared within a feature module',
        'Component level: new instance per component'
      ],
      important: [
        "providedIn: 'root' gives a singleton",
        'Component providers create a new instance each time'
      ],
      variant: 'purple'
    },
    {
      icon: 'bi-arrow-repeat',
      category: 'Performance',
      title: 'Change Detection',
      desc: 'Default change detection checks the entire component tree after every async event. OnPush narrows that down to only what actually changed.',
      points: [
        'Input reference changes trigger a check',
        'Events fired inside the component',
        'Manual triggers via markForCheck or detectChanges'
      ],
      important: [
        'Works best with immutable data patterns',
        'Avoids unnecessary full DOM re-checks'
      ],
      variant: 'blue'
    },
    {
      icon: 'bi-lightning-charge',
      category: 'State',
      title: 'RxJS vs Signals',
      desc: 'RxJS is the right tool for async data streams such as HTTP, events, and real-time feeds. Signals provide simpler, synchronous reactive state with automatic dependency tracking.',
      points: [
        'RxJS: async data like HTTP, WebSockets, and streams',
        'Signals: local UI state such as counters and toggles',
        'Both can interop via toSignal() and toObservable()'
      ],
      important: [
        'Do not replace HttpClient with Signals',
        'Use Signals for component-level UI logic'
      ],
      variant: 'amber'
    },
    {
      icon: 'bi-speedometer2',
      category: 'Optimization',
      title: 'Lazy Loading',
      desc: 'Lazy loading defers loading of feature modules or standalone components until a route is activated, shrinking the initial bundle and accelerating startup.',
      points: [
        'Route-based loading via dynamic import()',
        'Reduces initial JavaScript bundle size',
        'Works with both NgModules and standalone components'
      ],
      important: [
        'Configured directly in the Router',
        'Essential for scaling large applications'
      ],
      variant: 'green'
    },
    {
      icon: 'bi-shield-check',
      category: 'Networking',
      title: 'HTTP Interceptors',
      desc: 'Interceptors act as middleware between your app and the backend, letting you centrally handle auth tokens, errors, and logging without repeating logic in every service.',
      points: [
        'Attach Authorization headers automatically',
        'Centralize global error handling',
        'Log, transform, and cache requests in one place'
      ],
      important: [
        'Runs automatically for every HttpClient request',
        'Cleaner than duplicating logic across services'
      ],
      variant: 'blue'
    },
    {
      icon: 'bi-ui-checks-grid',
      category: 'Forms',
      title: 'Reactive Forms',
      desc: 'Reactive Forms give you explicit, model-driven control over form state and validation using FormControl, FormGroup, and FormArray in the component class.',
      points: [
        'Synchronous and asynchronous validators',
        'Dynamic form generation at runtime',
        'Highly testable without needing the DOM'
      ],
      important: [
        'Preferred over template-driven forms in real apps',
        'FormBuilder shorthand keeps code concise'
      ],
      variant: 'red'
    },
    {
      icon: 'bi-signpost-split',
      category: 'Routing',
      title: 'Route Guards',
      desc: 'Route Guards intercept navigation and enforce conditions, blocking unauthenticated users, preventing data loss, or pre-fetching data before a view loads.',
      points: [
        'CanActivate: allow or block the route',
        'CanDeactivate: prevent leaving with unsaved work',
        'Resolve: fetch data before the component renders'
      ],
      important: [
        'Core building block of auth systems',
        'Improves both UX and application security'
      ],
      variant: 'amber'
    },
    {
      icon: 'bi-boxes',
      category: 'Scalability',
      title: 'Project Structure',
      desc: 'Scalable Angular projects separate concerns across Core, Shared, and Feature layers, keeping the codebase maintainable as teams and features grow.',
      points: [
        'Core module: singleton services and global config',
        'Shared module: reusable components, pipes, directives',
        'Feature modules: isolated domain-specific functionality'
      ],
      important: [
        'Avoid packing everything into one module',
        'Feature isolation makes testing and collaboration easier'
      ],
      variant: 'green'
    }
  ]);
  readonly topics$: Observable<TopicCard[]> = this.topicsSubject.asObservable();
}