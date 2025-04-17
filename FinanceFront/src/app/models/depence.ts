export class Depense {
  constructor(
    public id: number,
    public idProjet: string,
    public montant: number,
    public type: string,
    public date: Date,
    public description: string,
    public statut: string,
    public fileData: Uint8Array | null
  ) {}

  public static fromJson(json: any): Depense {
    return new Depense(
      json['id'],
      json['idProjet'],
      json['montant'],
      json['type'],
      json['date'],
      json['description'],
      json['statut'],
      json['fileData']
    );
  }
}
