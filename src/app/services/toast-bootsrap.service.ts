// toast.service.ts
import {Injectable} from '@angular/core';

export enum Icon {
  success = 'assets/img/ic_success.png',
  info = 'assets/img/ic_info.png'
}

export enum Duration {
  short = 4000,
  long = 6000
}


@Injectable()
export class ToastBootsrapService {

  toasts: any[] = [];

  // Push new Toasts to array with title , description and options
  show(id: number, title: string, description: string, options: any = {}) {
    if (options.icon === undefined) {
      options.icon = Icon.info;
    }
    if (options.timestamp === undefined) {
      options.timestamp = 'Maintenent';
    }
    if (options.duration === undefined) {
      options.duration = Duration.short;
    }
    this.toasts.push({id, title, description, ...options});
    setTimeout(() => {
      this.toasts.splice(0, 1);
    }, options.duration);

  }

  // remove Toast  element from array if needed
  remove(toast) {
    this.toasts = this.toasts.filter(t => t !== toast);
  }

  getToasts(): any[] {
    return this.toasts;
  }
}
