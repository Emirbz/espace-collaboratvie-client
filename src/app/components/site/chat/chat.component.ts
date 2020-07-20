import {AfterViewInit, Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, AfterViewInit {
  loadAPI: Promise<any>;

  ngAfterViewInit() {


    }

  constructor() {

  }

  ngOnInit() {
    this.loadScript('assets/js/main.js');
    this.loadScript('assets/js/libs-init/libs-init.js');
  }

  public loadScript(url) {
    const node = document.createElement('script');
    node.src = url;
    node.type = 'text/javascript';
    document.getElementsByTagName('head')[0].appendChild(node);
  }

}
