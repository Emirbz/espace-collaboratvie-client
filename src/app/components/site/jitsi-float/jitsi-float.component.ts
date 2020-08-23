import {Component, OnInit} from '@angular/core';
import * as JitsiMeetExternalAPI from '../../../../assets/js/Jitsi/external_api';


@Component({
  selector: 'app-jitsi-float',
  templateUrl: './jitsi-float.component.html',
  styleUrls: ['./jitsi-float.component.css']
})
export class JitsiFloatComponent implements OnInit {
  domain = 'meet.jit.si';
  options: any;
  apiJitsi: any;

  constructor() {
  }

  ngOnInit() {
    this.openJitsi();
  }

  openJitsi() {
    this.options = {
      roomName: 'toutou',
      width: 500,
      height: 350,
      parentNode: document.querySelector('#jitsi')
    };
    this.apiJitsi = new JitsiMeetExternalAPI(this.domain, this.options);
  }

}
