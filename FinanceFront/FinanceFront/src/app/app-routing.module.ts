import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './components/Front/login/login.component';

import { ProfileComponent } from './components/Back/profile/profile.component';

import { HomeBackComponent } from './components/Back/home-back/home-back.component';
import { HrProfileComponent } from './components/Front/hr-profile/hr-profile.component';

import { InternshipsBackComponent } from './components/Back/internships-back/internships-back.component';
import { ApplicationsBackComponent } from './components/Back/applications-back/applications-back.component';
import { HomeFrontComponent } from './components/Front/home-front/home-front.component';
import { WelcomeViewComponent } from './components/Front/welcome-view/welcome-view.component';

import { HomeHrComponent } from './components/Front/hrDashboard/home-hr/home-hr.component';
import { ProfileHrComponent } from './components/Front/profile-hr/profile-hr.component';
import { AfficheProjectComponent } from './components/Back/depense/affiche-project/affiche-project.component';
import { VoirDepenseComponent } from './components/Back/depense/voir-depense/voir-depense.component';

const routes: Routes = [
  { path: '', component: HomeFrontComponent },
  { path: 'login', component: LoginComponent },
  { path: 'homeFront', component: HomeFrontComponent },

  { path: 'welcomeV', component: WelcomeViewComponent },

  { path: 'homeBack/:id', component: HomeBackComponent },
  { path: 'HrDashboard', component: HomeHrComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'profileHr', component: ProfileHrComponent },
  { path: 'internshipsBack', component: InternshipsBackComponent },
  { path: 'applicationsBack', component: ApplicationsBackComponent },

  { path: 'hr-profile/:id', component: HrProfileComponent },

  { path: 'project', component: AfficheProjectComponent },
  { path: 'afficheDepense/:id', component: VoirDepenseComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
