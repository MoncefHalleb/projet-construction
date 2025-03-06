import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {KeycloakService} from "keycloak-angular";
import {UserServiceService} from "./Services/UserService/user-service.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  title = 'test1';
  constructor(private us : UserServiceService) {
  console.log("creating app component");
  }

  ngOnInit() {
   // this.us.redirectAfterLogin();
  }



}
