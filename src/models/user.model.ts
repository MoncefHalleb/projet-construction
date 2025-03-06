import { Postulation } from "./postulation.model";

export enum RoleUser {
  SUPER_ADMIN = 'admin',
  ETUDIANT = 'ETUDIANT',
  AGENT_ENTREPRISE = 'AGENT_ENTREPRISE',
  AGENT_STAGE = 'AGENT_STAGE'
}

export class User {
  id_User!: number;
  login!: string;
  nom!: string;
  prenom!: string;
  password!: string;
  roleUser!: RoleUser;
  classe!: string;
  email!: string;
  num_tel!: number;
  role_enreprise!: string;
  identifiant!: string;
  specialite!: string;
  //postSet!: Post[];
 // reclamationSet!: Reclamation[];
  fileSet!: File[];
//  conventionSet!: Convention[];
  postulations!: Postulation[];
}
