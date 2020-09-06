import {Component, OnInit} from '@angular/core';
import {FileService} from '../../../services/file.service';


@Component({
  selector: 'app-jitsi-float',
  templateUrl: './jitsi-float.component.html',
  styleUrls: ['./jitsi-float.component.css']
})
export class JitsiFloatComponent implements OnInit {
  domain = 'meet.jit.si';
  options: any;
  apiJitsi: any;
  uploadProgress: number;

  constructor(private fileService: FileService) {
  }

  ngOnInit() {

  }


  uploadFile(event) {
    this.fileService.uploadFile(event.target.files[0], true).subscribe(value => {

      if (value !== undefined) {
        if (!isNaN(value)) {
          this.uploadProgress = value;
        } else if (value instanceof Array) {
          console.log('id: ' + value[0].id);

        }
      }
    });


  }

}
