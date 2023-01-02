import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ProfilePageComponent } from './profile-page/profile-page.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { AccueilComponent } from './accueil/accueil.component';
import { AddAstuceComponent } from './add-astuce/add-astuce.component';
import { AdminComponent } from './admin/admin.component';
import { MyAstuceComponent } from './my-astuce/my-astuce.component';
import { AdminAstuceComponent } from './admin-astuce/admin-astuce.component';

const routes: Routes = [
  { path: '', redirectTo: '/accueil', pathMatch: 'full' },
  { path: 'register', component: RegisterComponent },
  {path: 'login', component: LoginComponent},
  {path: 'profile-page', component:ProfilePageComponent},
  {path: 'edit-profile', component:EditProfileComponent},
  {path: 'accueil', component:AccueilComponent},
  {path: 'add-astuce', component:AddAstuceComponent},
  {path: 'admin', component:AdminComponent},
  {path: 'my-astuce', component:MyAstuceComponent},
  {path: 'astuce-admin', component:AdminAstuceComponent}

];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
