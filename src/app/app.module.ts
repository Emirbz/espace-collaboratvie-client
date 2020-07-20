import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/layout/header/header.component';
import { SidemenuComponent } from './components/layout/sidemenu/sidemenu.component';
import { RoomsComponent } from './components/site/rooms/rooms.component';
import { ChatComponent } from './components/site/chat/chat.component';
import {RoomService} from './services/room.service';
import { HttpClientModule } from '@angular/common/http';
import {AvatarModule} from 'ngx-avatar';
import {UserService} from './services/user.service';
import { NgSelectModule } from '@ng-select/ng-select';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TitleService} from './services/title.service';




@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SidemenuComponent,
    RoomsComponent,
    ChatComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    AvatarModule,
    NgSelectModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    RoomService,
    UserService,
    TitleService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
