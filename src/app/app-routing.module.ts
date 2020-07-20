import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {RoomsComponent} from './components/site/rooms/rooms.component';
import {ChatComponent} from './components/site/chat/chat.component';


const routes: Routes = [

  {path: 'rooms', component: RoomsComponent,  },
  {path: 'rooms/:id', component: ChatComponent,  },
  { path: '',
    redirectTo: '/rooms',
    pathMatch: 'full'
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
