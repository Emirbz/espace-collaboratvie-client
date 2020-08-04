import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {RoomsComponent} from './components/site/rooms/rooms.component';
import {ChatComponent} from './components/site/chat/chat.component';
import {AppAuthGuard} from './config/AppAuthGuard';
import {PageNotFoundComponent} from './components/layout/page-not-found/page-not-found.component';
import {PathResolveService} from './services/path-resolve.service';
import {ListTopicsComponent} from './components/topic/list-topics/list-topics.component';
import {DetailsTopicComponent} from './components/topic/details-topic/details-topic.component';
import {CreateTopicComponent} from './components/topic/create-topic/create-topic.component';
import {ProfileComponent} from './components/site/profile/profile.component';


export const paths = {
  rooms: 'rooms',
  chat: 'rooms/:id',
  pageNotFound: '404',
  listTopics: 'topic',
  createTopic: 'topic/create',
  detailsTopic: 'topic/:id',
  profile: 'profile'
};
const routes: Routes = [

  {path: paths.rooms, component: RoomsComponent, canActivate: [AppAuthGuard]},
  {path: paths.chat, component: ChatComponent, canActivate: [AppAuthGuard]},
  {path: paths.pageNotFound, component: PageNotFoundComponent},
  {path: paths.createTopic, component: CreateTopicComponent, canActivate: [AppAuthGuard]},
  {path: paths.listTopics, component: ListTopicsComponent, canActivate: [AppAuthGuard]},
  {path: paths.detailsTopic, component: DetailsTopicComponent, canActivate: [AppAuthGuard]},
  {path: paths.profile, component: ProfileComponent, canActivate: [AppAuthGuard]},
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
export class AppRoutingModule {
}
