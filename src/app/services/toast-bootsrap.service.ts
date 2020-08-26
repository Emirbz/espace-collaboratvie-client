// toast.service.ts
import {Injectable} from '@angular/core';

@Injectable()
export class ToastBootsrapService {

  toasts: any[] = [];

  // Push new Toasts to array with title , description and options
  show(id: number, title: string, description: string, options: any = {}) {
    this.toasts.push({id, title, description, ...options});
    setTimeout(() => {
      this.toasts.splice(0, 1);
    }, 4000);

  }

  // remove Toast  element from array if needed
  remove(toast) {
    this.toasts = this.toasts.filter(t => t !== toast);
  }

  getToasts(): any[] {
    return this.toasts;
  }
}
