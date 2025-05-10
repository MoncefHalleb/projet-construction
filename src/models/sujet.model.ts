import { Postulation } from "./postulation.model";

export enum TypeSujet {
  STAGE_FORMATION_HUMAINE_SOCIALE = 'STAGE_FORMATION_HUMAINE_SOCIALE',
  STAGE_IMMERSION_ENTREPRISE = 'STAGE_IMMERSION_ENTREPRISE',
  STAGE_INGENIEUR = 'STAGE_INGENIEUR'
}
export class Sujet {
  idsujet!: number;
  titre!: string;
  description!: string;
  lieu!: string;
  duree!: number;
  nbretudiant!: number;
  requirements!: string;
  nomentreprise!: string;
  mailentreprise!: string;
  typesujet!: TypeSujet;
  postulationtSet!: Postulation[];
}
