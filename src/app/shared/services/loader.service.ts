import { Injectable, signal, WritableSignal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoaderService {
  $isShown: WritableSignal<boolean> = signal(false);

  show() {
    this.$isShown.set(true);
  }

  hide() {
    this.$isShown.set(false);
  }
}
