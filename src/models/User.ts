import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { ROLES, RoleType } from "../config";

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column({ nullable: true })
  resetToken?: string;

  @Column({ type: "enum", enum: ROLES, default: ROLES.CLIENT })
  role!: RoleType;
}
