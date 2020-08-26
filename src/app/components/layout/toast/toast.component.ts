import {Component, OnInit} from '@angular/core';
import {ToastBootsrapService} from '../../../services/toast-bootsrap.service';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.css']
})
export class ToastComponent implements OnInit {
  /*------ loaded services ------ */
  loadedToasts: any[];
  deletedToast: number;

  constructor(private toastBootsrapService: ToastBootsrapService) {
  }

  ngOnInit() {
    this.loadToasts();
  }

  loadToasts() {

    this.loadedToasts = this.toastBootsrapService.getToasts();
  }


  removeToast(t: any) {
    this.deletedToast = t.id;

    setTimeout(() => {
      this.toastBootsrapService.remove(t);
      this.loadToasts();
    }, 500);

  }
}
