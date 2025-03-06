import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FrontHomeComponent } from './front/front-home/front-home.component';
import { BackHomeComponent } from './back/back-home/back-home.component';

import { ReclamationComponent } from './components/Reclamationn/reclamation/reclamation.component';
import { MatIconModule } from '@angular/material/icon';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MatSelectModule } from '@angular/material/select';
import { ReponseComponent } from './components/Reponsee/reponse/reponse.component';
import { ReclamationListComponent } from './components/Reclamationn/reclamation-list/reclamation-list.component';
import { ReclamationEditComponent } from './components/Reclamationn/reclamation-edit/reclamation-edit.component';
import { ReponseListComponent } from './components/Reponsee/reponse-list/reponse-list.component';
import { KeycloakAngularModule, KeycloakService } from "keycloak-angular";
import { UserManagementComponentComponent } from './back/UserComponents/user-management-component/user-management-component.component';
import { ProfileBackComponent } from './back/UserComponents/profile-back/profile-back.component';
import { ToastrModule } from 'ngx-toastr';
import { UpdateUserComponent } from './back/UserComponents/update-user/update-user.component';
import { LoginComponent } from './login/login.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NavBarComponent } from './back/nav-bar/nav-bar.component';
import { NavBarFrontComponent } from './front/nav-bar-front/nav-bar-front.component';
import { JournalComponent } from './back/journal/journal.component';
import { HttpClientModule } from "@angular/common/http";
import { MatDialogModule } from "@angular/material/dialog";
import { FormsModule } from "@angular/forms";
import { MatFormField } from "@angular/material/form-field";
import { MatOption } from "@angular/material/autocomplete";
import { MatSelect } from "@angular/material/select";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { FileUploadComponent } from './front/file-upload/file-upload.component';
import { ReclamationStatistiqueComponent } from './components/Reclamationn/reclamation-statistique/reclamation-statistique.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ReclamationEditUserComponent } from './components/Reclamationn/reclamation-edit-user/reclamation-edit-user.component';
import { ReclamationListUserComponent } from './components/Reclamationn/reclamation-list-user/reclamation-list-user.component';
import { AllFilesComponent } from './back/all-files/all-files.component';
import { AccountsUploaderComponent } from "./back/UserComponents/accounts-uploader/accounts-uploader.component";
import { ReponseEditComponent } from './components/Reponsee/reponse-edit/reponse-edit.component';
import { UserServiceService } from './Services/UserService/user-service.service';
import { ProfileComponent } from './profile/profile.component';
import { UpdateprofileComponent } from './updateprofile/updateprofile.component';





function initializeKeycloak(keycloak: KeycloakService) {
  return () =>
    keycloak.init({
      config: {
        url: 'http://localhost:8080',
        realm: 'constructionRealm',
        clientId: 'frontapp',
      },
      initOptions: {
        onLoad: 'check-sso',
        checkLoginIframe: false,
      },
      bearerExcludedUrls: ['/assets'],
    });

}
@NgModule({
  declarations: [
    AppComponent,
    FrontHomeComponent,
    BackHomeComponent,
    LoginComponent,
    NavBarComponent,
    NavBarFrontComponent,
    ReclamationComponent,
    ReponseComponent,
    ReclamationListComponent,
    ReclamationEditComponent,
    ReponseListComponent,
    NavBarFrontComponent,
    UserManagementComponentComponent,
    LoginComponent,
    ProfileBackComponent,
    UpdateUserComponent,
    LoginComponent,
    NavBarComponent,
    NavBarFrontComponent,
    NavBarFrontComponent,
    JournalComponent,
    FileUploadComponent,
    FileUploadComponent,
    ReclamationStatistiqueComponent,
    ReclamationEditUserComponent,
    ReclamationListUserComponent,
    AllFilesComponent,
    AccountsUploaderComponent,
    ReponseEditComponent,
    ProfileComponent,
    UpdateprofileComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    NgbModule,
    HttpClientModule,
    MatDialogModule,
    MatFormFieldModule,
    MatOption,
    MatSelectModule,
    BrowserAnimationsModule,
    MatInputModule,
    ReactiveFormsModule,
    MatIconModule,
    KeycloakAngularModule,
    NgxChartsModule,
    ToastrModule.forRoot({ // Configure Toastr globally
      timeOut: 3000, // Set default timeout for notifications in milliseconds
      positionClass: 'toast-top-right', // Set default position
      preventDuplicates: true, // Prevent duplicate notifications
      progressBar: true // Display a progress bar
    })

  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: initializeKeycloak,
      multi: true,
      deps: [KeycloakService],
    },
    provideAnimationsAsync(),
   UserServiceService, // ✅ Ensure it's registered here

  ],
  bootstrap: [AppComponent]
})
export class AppModule {


}
