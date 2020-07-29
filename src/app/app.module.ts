import {BrowserModule} from '@angular/platform-browser';
import {DoBootstrap, NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HeaderComponent} from './components/layout/header/header.component';
import {SidemenuComponent} from './components/layout/sidemenu/sidemenu.component';
import {RoomsComponent} from './components/site/rooms/rooms.component';
import {ChatComponent} from './components/site/chat/chat.component';
import {RoomService} from './services/room.service';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {AvatarModule} from 'ngx-avatar';
import {UserService} from './services/user.service';
import {NgSelectModule} from '@ng-select/ng-select';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TitleService} from './services/title.service';
import {AngularFontAwesomeModule} from 'angular-font-awesome';
import {ChatService} from './services/chat.service';
import {KeycloakAngularModule, KeycloakService} from 'keycloak-angular';
import {environment} from '../environments/environment';
import {AuthInterceptor} from './config/AuthInterceptor';
import {TimeAgoPipe} from 'time-ago-pipe';


const keycloakService: KeycloakService = new KeycloakService();


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SidemenuComponent,
    RoomsComponent,
    ChatComponent,
    TimeAgoPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    AvatarModule,
    NgSelectModule,
    FormsModule,
    ReactiveFormsModule,
    AngularFontAwesomeModule,
    KeycloakAngularModule
  ],
  providers: [
    RoomService,
    UserService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    TitleService,
    ChatService,
    {
      provide: KeycloakService,
      useValue: keycloakService
    },
  ],
  entryComponents: [AppComponent]
})
export class AppModule implements DoBootstrap {
  async ngDoBootstrap(app) {
    const {keycloak} = environment.apis;

    try {
      await keycloakService.init({config: keycloak});
      app.bootstrap(AppComponent);
    } catch (error) {
      console.error('Keycloak init failed', error);
    }
  }
}
