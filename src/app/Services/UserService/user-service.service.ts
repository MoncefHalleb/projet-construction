import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from "@angular/router";
import { KeycloakService } from "keycloak-angular";
import { KeycloakUser, keyCredential } from "../../Modules/UserModule/KeycloakUserRep";
import { User, UserWrapper } from "../../Modules/UserModule/User";
import { Observable } from 'rxjs/internal/Observable';
import { ApiResponse } from '../../../models/ApiResponse.model';

@Injectable({
  providedIn: 'root'
})
export class UserServiceService {

  url: string = "http://localhost:8088/api/service/user";
  currentUser: any = {};

  constructor(private http: HttpClient, private keycloakService: KeycloakService, private router: Router) {
    this.keycloakService.getKeycloakInstance().onTokenExpired = () => {
      console.log('Token expired');
      this.updateTokenOnFailure();
    };
  }
  getUserLoginHistory(username: string): Observable<any> {
    return this.http.get<any>(`${this.url}/GetUserLoginHistory/${username}`);
  }
  
  createUser(): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.url}/registerAllFromKeycloak`, {});
  }
  private async updateTokenOnFailure() {
    try {
      const newToken = await this.keycloakService.getKeycloakInstance().updateToken(5);
      console.log('Token refreshed explicitly:', newToken);
    } catch (error) {
      console.error('Failed to refresh token:', error);
    }
  }

  // 🔹 Function to get a predefined role (ADMIN or USER)
  getPredefinedRole(): string {
    const roles = this.keycloakService.getUserRoles();

    if (roles.includes('admin')) {
      return 'admin';
    } else if (roles.includes('user')) {
      return 'user';
    }

    return 'GUEST'; // Default fallback role
  }
  /**
 * ✅ Fetch all users directly from Keycloak
 */
getAllUsersFromKeycloak(): Observable<User[]> {
  return this.http.get<User[]>(`${this.url}/GetAllUsersFromKeycloak`);
}

  // 🔹 Function to add user with only a predefined role
  adduser(u: User, password: string, role: string, fn: string, ln: string) {
    let creds = new keyCredential('password', password, true);
  
    // Select only the first role (or specify manually)
    let selectedRole = role.includes('admin') ? 'admin' : 'user';
  
    let keyUser: KeycloakUser = new KeycloakUser(u.login, true, u.email, [creds], [selectedRole], fn, ln);
    let userWrapper: UserWrapper = new UserWrapper(keyUser, u);
  
    console.log('UserWrapper JSON:', JSON.stringify(userWrapper));
    return this.http.post<ApiResponse<User>>(this.url + '/CreateUser', userWrapper).pipe();
  }
  registerUserFromKeycloak(email: string): Promise<UserWrapper | null> {
    return this.getUserByEmail(email).toPromise()
      .then(response => {
        if (response && response.user) {
          console.log("✅ User found in DB:", response.user);
          return response;
        } else {
          console.warn("⚠ User not found in DB, registering from Keycloak...");
          return null;
        }
      })
      .catch(error => {
        console.error("❌ User not found, registering from Keycloak...", error);
        return null;
      });
  }


  getCurrentUser(): Promise<any> {
    const keycloak = this.keycloakService.getKeycloakInstance();
  
    if (keycloak.authenticated) {
      return keycloak.loadUserInfo().then(userInfo => {
        this.currentUser = userInfo;
  
        // ✅ Fetch roles separately
        const roles = this.keycloakService.getUserRoles();
  
        // ✅ Correct Role Assignment
        if (roles.includes('admin')) {
          this.currentUser.role = 'admin';
        } else if (roles.includes('user')) {
          this.currentUser.role = 'user';
        } else {
          this.currentUser.role = 'GUEST'; // Default role if neither found
        }
  
        console.log('✅ Current user:', this.currentUser);
        console.log('✅ Role:', this.currentUser.role);
  
        return this.currentUser;
      });
    } else {
      return Promise.reject('User is not authenticated');
    }
  }
 
  
  // 🔹 Ensure registration if user is missing
 

  getUsers() {
    return this.http.get<User[]>(this.url + '/GetAllUsers');
  }

  getUserByEmail(email: string): Observable<UserWrapper> {
    return this.http.get<UserWrapper>(`${this.url}/GetUserByEmail/${email}`);
  }

  getUserByLogin(username: string): Observable<ApiResponse<UserWrapper>> {
    return this.http.get<ApiResponse<UserWrapper>>(
      `http://localhost:8088/api/service/user/GetUserByUserName/${username}`
    );}

  updateUser(u: User, fn: string, ln: string, lastName: any) {
    let predefinedRole = this.getPredefinedRole();
    let keyUser: KeycloakUser = new KeycloakUser(u.login, true, u.email, [], [predefinedRole], fn, ln);
    let userWrapper: UserWrapper = new UserWrapper(keyUser, u);
    
    console.log('Updating user with role:', predefinedRole);
    
    return this.http.put<ApiResponse<User>>(this.url + '/UpdateUser', userWrapper);
  }

  deleteUser(username: string) {
    return this.http.delete<ApiResponse<any>>(`${this.url}/DeleteUser/${username}`);
  }
}
