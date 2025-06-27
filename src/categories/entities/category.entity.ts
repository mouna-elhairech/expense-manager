import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Depenses } from 'src/entities/entities/Depenses';
import { NlpCategorization } from 'src/entities/entities/NlpCategorization';


@Index('categories_pkey', ['id'], { unique: true })
@Entity('categories', { schema: 'public' })
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('character varying', { name: 'nom', length: 100 })
  nom: string;

  @Column('character varying', { name: 'icone', nullable: true, length: 100 })
  icone: string | null;

  @Column('numeric', {
    name: 'limite_budget',
    nullable: true,
    precision: 10,
    scale: 2,
  })
  limiteBudget: string | null;

  @OneToMany(() => Depenses, (dep) => dep.categorie)
  depenses: Depenses[];

  @OneToMany(() => NlpCategorization, (nlp) => nlp.categorieProposee)
  nlpCategorizations: NlpCategorization[];
}
