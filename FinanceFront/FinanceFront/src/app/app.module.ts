import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/Front/login/login.component';

import { AsideComponent } from './components/Back/aside/aside.component';
import { FooterBackComponent } from './components/Back/footer-back/footer-back.component';
import { HomeBackComponent } from './components/Back/home-back/home-back.component';
import { NavBackComponent } from './components/Back/nav-back/nav-back.component';
import { ProfileComponent } from './components/Back/profile/profile.component';
import { SettingsComponent } from './components/Back/settings/settings.component';
import { HrProfileComponent } from './components/Front/hr-profile/hr-profile.component';
import { HttpClientModule } from '@angular/common/http';
import { InternshipsBackComponent } from './components/Back/internships-back/internships-back.component';
import { ApplicationsBackComponent } from './components/Back/applications-back/applications-back.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HomeFrontComponent } from './components/Front/home-front/home-front.component';
import { FooterComponent } from './components/Front/footer/footer.component';
import { NavbarComponent } from './components/Front/navbar/navbar.component';
import { WelcomeViewComponent } from './components/Front/welcome-view/welcome-view.component';
import { ContactComponent } from './components/Front/contact/contact.component';
import { AboutComponent } from './components/Front/about/about.component';
import { NavbarStudentComponent } from './components/Front/navbar-student/navbar-student.component';
import { NavbarHrComponent } from './components/Front/navbar-hr/navbar-hr.component';
import { HomeHrComponent } from './components/Front/hrDashboard/home-hr/home-hr.component';
import { ProfileHrComponent } from './components/Front/profile-hr/profile-hr.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { AfficheProjectComponent } from './components/Back/depense/affiche-project/affiche-project.component';
import { VoirDepenseComponent } from './components/Back/depense/voir-depense/voir-depense.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeFrontComponent,
    HrProfileComponent,
    HomeFrontComponent,
    FooterComponent,
    NavbarComponent,
    WelcomeViewComponent,
    ContactComponent,
    AboutComponent,
    NavbarStudentComponent,
    NavbarHrComponent,
    HomeHrComponent,
    ProfileHrComponent,
    AfficheProjectComponent,
    VoirDepenseComponent,
  ],
  imports: [
    NgxPaginationModule,
    ReactiveFormsModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    AsideComponent,
    InternshipsBackComponent,
    FooterBackComponent,
    HomeBackComponent,
    NavBackComponent,
    ProfileComponent,
    ApplicationsBackComponent,
    SettingsComponent,
    NgbModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
