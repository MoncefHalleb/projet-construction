import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { KeycloakAuthGuard, KeycloakService } from 'keycloak-angular';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard extends KeycloakAuthGuard {
  userRoles!: string[];
  constructor(
    protected override readonly router: Router,
    protected readonly keycloak: KeycloakService
  ) {
    super(router, keycloak);
    console.log("Creating AuthGuard");
  }

  async isAccessAllowed(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean | UrlTree> {
    console.log("🔍 Checking access...");

    this.authenticated = await this.keycloak.isLoggedIn();
    console.log("🔐 Authenticated:", this.authenticated);

    if (!this.authenticated) {
      console.log("🔴 Not authenticated! Redirecting to login...");
      await this.keycloak.login({ redirectUri: window.location.origin + state.url });
      return false;
    }

    this.userRoles = this.keycloak.getUserRoles();
    console.log("✅ User Roles:", this.userRoles);

    // Get required roles for the route
    const requiredRoles = route.data['roles'] as string[];
    if (!requiredRoles) {
      console.log("⚠️ No roles defined for this route. Access denied.");
      return this.router.createUrlTree(['/unauthorized']);
    }

    const userHasRequiredRole = requiredRoles.some(role => this.userRoles.includes(role));

    if (userHasRequiredRole) {
      console.log("✅ User has required role. Access granted.");
      return true;
    }

    console.log("❌ User does not have access. Redirecting to unauthorized page.");
    return this.router.createUrlTree(['/unauthorized']); // Redirect to an error page if needed
  }
}
