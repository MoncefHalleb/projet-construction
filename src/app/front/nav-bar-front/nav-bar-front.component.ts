import { Component, OnInit } from '@angular/core';
import { KeycloakService } from "keycloak-angular";
import { ActivatedRoute, Router } from "@angular/router";
import { UserServiceService } from "../../Services/UserService/user-service.service";


@Component({
  selector: 'app-nav-bar-front',
  templateUrl: './nav-bar-front.component.html',
  styleUrl: './nav-bar-front.component.css'
})
export class NavBarFrontComponent implements OnInit {

  idUser: number = 0;
  email: string = '';
  role: string;

  constructor(private UserService: UserServiceService, private router: Router, private route: ActivatedRoute, private keycloakService: KeycloakService) { }


  getCurrentUser() {
    this.UserService.getCurrentUser()
      .then(userInfo => {
        this.email = userInfo.email;
        console.log(this.email);
        this.UserService. getUserByEmail(this.email).subscribe(user => {
          this.idUser = user.user.id_User;
          this.role = user.user.role;

          console.log("responce   " + this.idUser);

        });


      })
      .catch(error => {
        console.error(error); // Handle errors here
      });

  }




  logout() {
    this.keycloakService.logout();
  }

  ngOnInit(): void {
    this.getCurrentUser();

  }
}
