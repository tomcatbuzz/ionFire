import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TutorialGuard } from './guards/tutorial.guard';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'home',
    loadChildren: './home/home.module#HomePageModule',
    canActivate: [TutorialGuard]
  },
  { path: 'todo',
    loadChildren: './todo/todo.module#TodoPageModule',
    canActivate: [AuthGuard]
  },
  { path: 'tutorial', loadChildren: './tutorial/tutorial.module#TutorialPageModule' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
