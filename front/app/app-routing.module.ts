import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FrontHomeComponent } from "./front/front-home/front-home.component";
import { BackHomeComponent } from "./back/back-home/back-home.component";


import { ReclamationComponent } from "./components/Reclamationn/reclamation/reclamation.component";
import { ReclamationListComponent } from "./components/Reclamationn/reclamation-list/reclamation-list.component";
import { ReclamationEditComponent } from "./components/Reclamationn/reclamation-edit/reclamation-edit.component";
import { ReponseComponent } from "./components/Reponsee/reponse/reponse.component";
import { ReponseListComponent } from "./components/Reponsee/reponse-list/reponse-list.component";
import { AuthGuard } from "./guard/auth.guard";
import { UserManagementComponentComponent } from "./back/UserComponents/user-management-component/user-management-component.component";
import { NavBarComponent } from "./back/nav-bar/nav-bar.component";
import { NavBarFrontComponent } from "./front/nav-bar-front/nav-bar-front.component";
import { LoginComponent } from "./login/login.component";
import { ProfileBackComponent } from "./back/UserComponents/profile-back/profile-back.component";
import { UpdateUserComponent } from "./back/UserComponents/update-user/update-user.component";

import { FileUploadComponent } from './front/file-upload/file-upload.component';
import { AllFilesComponent } from './back/all-files/all-files.component';
import {
  ReclamationStatistiqueComponent
} from "./components/Reclamationn/reclamation-statistique/reclamation-statistique.component";
import {
  ReclamationListUserComponent
} from "./components/Reclamationn/reclamation-list-user/reclamation-list-user.component";
import {
  ReclamationEditUserComponent
} from "./components/Reclamationn/reclamation-edit-user/reclamation-edit-user.component";
import { ReponseEditComponent } from "./components/Reponsee/reponse-edit/reponse-edit.component";
import { ProfileComponent } from './profile/profile.component';
import { UpdateprofileComponent } from './updateprofile/updateprofile.component';

const routes: Routes = [


  { path: '', component: LoginComponent },
  {
    path: 'admins',
    canActivate: [AuthGuard],
    component: NavBarComponent,
    data: { roles: ['admin', 'Agententreprise'] },
    children:
      [
        { path: '', component: BackHomeComponent },
        { path: 'add', component: UserManagementComponentComponent },
        { path: 'profile', component: ProfileBackComponent },
        { path: 'update/:email', component: UpdateUserComponent },
        { path: 'reclamationList', component: ReclamationListComponent },
        { path: 'reclamationEdit/:id', component: ReclamationEditComponent },
        { path: 'reponse/:id', component: ReponseComponent },
        { path: 'reponseList', component: ReponseListComponent },
        { path: 'reponse', component: ReponseComponent },

        { path: 'filepostulation', component: AllFilesComponent },
        { path: 'reclamationStatistique', component: ReclamationStatistiqueComponent },
        { path: 'reponseEdit', component: ReponseEditComponent },
        { path: 'reponseEdit/:id', component: ReponseEditComponent },
        { path: 'reclamationListUser', component: ReclamationListUserComponent },
        { path: 'reclamationEditUser/:id', component: ReclamationEditUserComponent },
        { path: 'reclamationStatistique', component: ReclamationStatistiqueComponent },

      ]
  },
  {
    path: 'user',
    canActivate: [AuthGuard],
    component: NavBarFrontComponent,
    data: { roles: ['user', 'Agententreprise'] },
    children:
      [
        { path: '', component: ProfileComponent },
        { path: 'reclamation', component: ReclamationComponent },
        { path: 'profile', component: ProfileComponent },
        { path: 'updateprofile/:email', component: UpdateprofileComponent },
        { path: 'fileupload', component: FileUploadComponent },

        { path: 'reclamation', component: ReclamationComponent },
      ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
