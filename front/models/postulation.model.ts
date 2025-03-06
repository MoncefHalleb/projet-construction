import { User } from "./user.model";
import { Sujet } from "./sujet.model";
export class Postulation {
  idp!: number;
  datedeb!: Date;
  datefin!: Date;
  region!: string;
  titrecandidature!: string;
  lettremotivation!: string;
  status!: number;
  comm!: string;
  user!: User;
  sujet!: Sujet;
}
