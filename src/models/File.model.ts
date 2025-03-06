import { User } from "./user.model";

export interface File {
    idfile: number;
    fileurl: string;
    type: Typefile;
    user: User;
  }
  

  export enum Typefile {
    DEMANDE_STAGE = 'DEMANDE_STAGE',
    ATTESTATION = 'ATTESTATION',
    RAPPORT = 'RAPPORT',
  }