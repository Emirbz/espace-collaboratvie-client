import {BrowserModule} from '@angular/platform-browser';
import {DoBootstrap, LOCALE_ID, NgModule} from '@angular/core';

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
import {PageNotFoundComponent} from './components/layout/page-not-found/page-not-found.component';
import {PathResolveService} from './services/path-resolve.service';
import {ListTopicsComponent} from './components/topic/list-topics/list-topics.component';
import {DetailsTopicComponent} from './components/topic/details-topic/details-topic.component';
import {CreateTopicComponent} from './components/topic/create-topic/create-topic.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {TopicService} from './services/topic.service';
import {TagService} from './services/tag.service';
import {ReplyService} from './services/reply.service';
import {ProfileComponent} from './components/site/profile/profile.component';
import {en_US, NgZorroAntdModule, NZ_I18N, NZ_ICONS} from 'ng-zorro-antd';
import * as AllIcons from '@ant-design/icons-angular/icons';
import {IconDefinition} from '@ant-design/icons-angular';
import {registerLocaleData} from '@angular/common';
import {SearchService} from './services/search.service';
import localeFr from '@angular/common/locales/fr';
import {BadgeService} from './services/badge.service';
import {JitsiFloatComponent} from './components/site/jitsi-float/jitsi-float.component';
import {RoomRequestService} from './services/room-request.service';
import {ToastComponent} from './components/layout/toast/toast.component';
import {ToastBootsrapService} from './services/toast-bootsrap.service';
import {LightboxModule} from 'ngx-lightbox';

registerLocaleData(localeFr, 'fr');

const keycloakService: KeycloakService = new KeycloakService();

const antDesignIcons = AllIcons as {
  [key: string]: IconDefinition;
};
const icons: IconDefinition[] = Object.keys(antDesignIcons).map(key => antDesignIcons[key]);


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SidemenuComponent,
    RoomsComponent,
    ChatComponent,
    TimeAgoPipe,
    PageNotFoundComponent,
    ListTopicsComponent,
    DetailsTopicComponent,
    CreateTopicComponent,
    ProfileComponent,
    JitsiFloatComponent,
    ToastComponent,
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
    KeycloakAngularModule,
    BrowserAnimationsModule,
    NgZorroAntdModule,
    LightboxModule
  ],
  providers: [
    RoomService,
    UserService,
    TopicService,
    TagService,
    ReplyService,
    SearchService,
    RoomRequestService,
    PathResolveService,
    ToastBootsrapService,
    BadgeService,
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
    {provide: LOCALE_ID, useValue: 'fr'},
    {provide: NZ_I18N, useValue: en_US},
    {provide: NZ_ICONS, useValue: icons},

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
