import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {RoomsComponent} from './components/site/rooms/rooms.component';
import {ChatComponent} from './components/site/chat/chat.component';
import {AppAuthGuard} from './config/AppAuthGuard';


const routes: Routes = [

  {path: 'rooms', component: RoomsComponent, canActivate: [AppAuthGuard]},
  {path: 'rooms/:id', component: ChatComponent, canActivate: [AppAuthGuard]},
  {
    path: '',
    redirectTo: '/rooms',
    pathMatch: 'full'
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AppAuthGuard]
})
export class AppRoutingModule { }
