export class KeycloakUser {
  private username: string;
  private enabled: boolean;
  private firstName: string | null;
  private lastName: string | null;
  private email: string;
  private credentials: keyCredential[]; // Assuming Credential is another interface or class
  private realmRoles: string[] | null;

  constructor(username: string, enabled: boolean, email: string, credentials: keyCredential[], realmRoles: string[] | null, firstName: string | null = null, lastName: string | null = null) {
    this.username = username;
    this.enabled = enabled;
    this.email = email;
    this.credentials = credentials;
    this.realmRoles = realmRoles;
    this.firstName = firstName;
    this.lastName = lastName;
  }

  // Getters
  getUsername(): string {
    return this.username;
  }

  getEnabled(): boolean {
    return this.enabled;
  }

  getFirstName(): string | null {
    return this.firstName;
  }

  getLastName(): string | null {
    return this.lastName;
  }

  getEmail(): string {
    return this.email;
  }

  getCredentials(): keyCredential[] {
    return this.credentials;
  }

  getRealmRoles(): string[] | null {
    return this.realmRoles;
  }

  // Setters
  setUsername(username: string): void {
    this.username = username;
  }

  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }

  setFirstName(firstName: string | null): void {
    this.firstName = firstName;
  }

  setLastName(lastName: string | null): void {
    this.lastName = lastName;
  }

  setEmail(email: string): void {
    this.email = email;
  }

  setCredentials(credentials: keyCredential[]): void {
    this.credentials = credentials;
  }

  setRealmRoles(realmRoles: string[] | null): void {
    this.realmRoles = realmRoles;
  }
}

export class keyCredential {
  private type: string;
  private value: string;
  private temporary: boolean;

  constructor(type :string , value: string, temporary: boolean) {
    this.type = type;
    this.value = value;
    this.temporary = temporary;
  }

  // Getters
  getValue(): string {
    return this.value;
  }

  getTemporary(): boolean {
    return this.temporary;
  }

  // Setters
  setValue(value: string): void {
    this.value = value;
  }

  setTemporary(temporary: boolean): void {
    this.temporary = temporary;
  }
}
