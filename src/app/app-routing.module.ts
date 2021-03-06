import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TutorialGuard } from './guards/tutorial.guard';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    loadChildren: './home/home.module#HomePageModule',
    canActivate: [TutorialGuard]
  },
  { path: 'todo',
    loadChildren: './todo/todo.module#TodoPageModule',
    canActivate: [AuthGuard]
  },
  { path: 'tutorial', loadChildren: './tutorial/tutorial.module#TutorialPageModule' },
  { path: 'fcm', loadChildren: './fcm/fcm.module#FcmPageModule' },
  // { path: 'login', loadChildren: './login/login.module#LoginModule' },
  // { path: 'signup', loadChildren: './signup/signup.module#SignupModule' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  // imports: [RouterModule.forRoot(routes, { useHash: true })], This is used for Netlify
  exports: [RouterModule]
})
export class AppRoutingModule { }
