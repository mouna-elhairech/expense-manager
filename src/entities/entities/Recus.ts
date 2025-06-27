import { Column, Entity, Index, OneToMany, OneToOne, JoinColumn } from "typeorm";
import { Depenses } from "./Depenses";
import { OcrProcessing } from "./OcrProcessing";

@Index("recus_pkey", ["id"], { unique: true })
@Entity("recus", { schema: "public" })
export class Recus {
  @Column("uuid", { primary: true, name: "id" })
  id: string;

  @Column("character varying", { name: "nom_fichier", length: 255 })
  nomFichier: string;

  @Column("character varying", { name: "chemin_stockage", length: 255 })
  cheminStockage: string;

  @Column("numeric", {
    name: "montant",
    nullable: true,
    precision: 10,
    scale: 2,
  })
  montant: string | null;

  @Column("character varying", { name: "fournisseur", nullable: true })
  fournisseur: string | null;

  @Column("date", { name: "date", nullable: true })
  date: string | null;

  @Column("boolean", { name: "est_traite", nullable: true })
  estTraite: boolean | null;

  @Column("timestamp with time zone", { name: "date_creation" })
  dateCreation: Date;

  @Column("timestamp with time zone", { name: "date_mise_a_jour" })
  dateMiseAJour: Date;

  @OneToMany(() => Depenses, (depenses) => depenses.recu)
  depenses: Depenses[];

  // ✅ Relation directe avec le dernier OCR traité (1:1)
  @OneToOne(() => OcrProcessing, (ocr) => ocr.recu, {
    cascade: true,
    nullable: true,
    eager: true,
  })
  @JoinColumn({ name: 'ocr_processing_id' })
  ocrProcessing: OcrProcessing;
}
