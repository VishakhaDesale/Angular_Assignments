import { Injectable, signal, computed } from '@angular/core';

/**
 * Global application state managed with Angular Signals.
 * Signals are used here because these are synchronous, side-effect-free UI flags —
 * not async streams (which would use RxJS Observables).
 */
@Injectable({ providedIn: 'root' })
export class AppStateService {
  // ── Synchronous UI state → Signals ────────────────────────
  readonly isLoading = signal<boolean>(false);
  readonly errorMsg  = signal<string | null>(null);

  // ── Derived state → computed (auto-updates when deps change) ──
  readonly hasError = computed(() => this.errorMsg() !== null);

  setLoading(value: boolean): void       { this.isLoading.set(value); }
  setError(msg: string | null): void     { this.errorMsg.set(msg);    }
  clearError(): void                     { this.errorMsg.set(null);    }
}
