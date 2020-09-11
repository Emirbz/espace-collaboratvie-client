import {AfterViewInit, Component, ElementRef, OnInit} from '@angular/core';
import {UserService} from './services/user.service';
import {PathResolveService} from './services/path-resolve.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {
  status: number;

  constructor(private elementRef: ElementRef,
              private userService: UserService,
              private pathResolveService: PathResolveService) {
  }

  ngOnInit(): void {
    this.getStatus();
    this.getLoggedUser();
    this.initBootstrapToolTip();

  }

  ngAfterViewInit() {
    this.loadScript('assets/js/main.js');
    this.loadScript('assets/js/libs-init/libs-init.js');


  }

  public loadScript(url) {
    const node = document.createElement('script');
    node.src = url;
    node.type = 'text/javascript';
    document.getElementsByTagName('body')[0].appendChild(node);


  }

  getStatus() {
    this.pathResolveService.getStatus().subscribe(status => {
      this.status = status;
    });
  }

  getLoggedUser() {
    this.userService.getLoggedUser().subscribe(user => {
      this.userService.setUser(user);
    });
  }

  hideChromeScrollWarning() {
    document.addEventListener('wheel', e => {
      e.preventDefault(); // does nothing since the listener is passive
    }, {
      passive: true
    });
  }

  private initBootstrapToolTip() {
    // @ts-ignore
    $('body').tooltip({selector: '[data-toggle=tooltip]'}).click(() => {
      // @ts-ignore
      $('.tooltip').fadeOut('fast', () => {
        // @ts-ignore
        $('.tooltip').remove();
      });
    });
  }
}

