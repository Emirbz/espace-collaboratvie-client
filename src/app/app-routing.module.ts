import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {RoomsComponent} from './components/site/rooms/rooms.component';
import {ChatComponent} from './components/site/chat/chat.component';
import {AppAuthGuard} from './config/AppAuthGuard';
import {PageNotFoundComponent} from './components/layout/page-not-found/page-not-found.component';
import {PathResolveService} from './services/path-resolve.service';


export const paths = {
  rooms: 'rooms',
  chat: 'rooms/:id',
  pageNotFound: '404'
};
const routes: Routes = [

  {path: paths.rooms, component: RoomsComponent, canActivate: [AppAuthGuard]},
  {path: paths.chat, component: ChatComponent, canActivate: [AppAuthGuard]},
  {path: paths.pageNotFound, component: PageNotFoundComponent},
  {
    path: '',
    redirectTo: paths.rooms,
    pathMatch: 'full'
  },
  {
    path: '**',
    resolve: {
      path: PathResolveService
    },
    component: PageNotFoundComponent
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AppAuthGuard]
})
export class AppRoutingModule { }
