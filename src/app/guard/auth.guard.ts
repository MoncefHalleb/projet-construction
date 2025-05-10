import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { KeycloakAuthGuard, KeycloakService } from 'keycloak-angular';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard extends KeycloakAuthGuard {
  userRoles: string[] = []; // ✅ Ensure userRoles is declared

  constructor(
    protected override readonly router: Router,
    protected readonly keycloak: KeycloakService
  ) {
    super(router, keycloak);
    console.log("✅ AuthGuard Initialized");
  }

  async isAccessAllowed(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean | UrlTree> {
    console.log("🔍 Checking access...");

    // ✅ Ensure Keycloak is initialized before checking authentication
    this.authenticated = await this.keycloak.isLoggedIn();

    console.log("🔐 Authenticated:", this.authenticated);

    if (!this.authenticated) {
      console.warn("🔴 Not authenticated! Redirecting to login...");
      await this.keycloak.login({ redirectUri: window.location.origin + state.url });
      return false;
    }

    // ✅ Retrieve user roles after authentication check
    this.userRoles = await this.keycloak.getUserRoles();
    console.log("✅ User Roles:", this.userRoles);

    // ✅ Prevent unwanted redirection on refresh
    if (this.userRoles.length === 0) {
      console.warn("⚠ No roles found, waiting for Keycloak...");
      return false;
    }

    // Get required roles for the route
    const requiredRoles = route.data['roles'] as string[] | undefined;

    // ✅ Allow access if the route has no specific role restrictions
    if (!requiredRoles || requiredRoles.length === 0) {
      console.log("✅ No specific roles required. Access granted.");
      return true;
    }

    // ✅ Ensure user has at least one required role
    const userHasRequiredRole = requiredRoles.some(role => this.userRoles.includes(role));

    if (userHasRequiredRole || this.userRoles.includes('user')) {
      console.log("✅ User has required role. Access granted.");
      return true;
    }

    console.error("❌ User does not have access. Redirecting to unauthorized page.");
    return this.router.createUrlTree(['/unauthorized']); // Redirect if access is denied
  }
}
