import { Exclude } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserRole } from './user.roles';
import * as bcrypt from 'bcryptjs';

@Entity()
export class User {
  @PrimaryGeneratedColumn() id: string;

  @IsString()
  @IsNotEmpty()
  @Column()
  name: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @Column({ unique: true })
  email: string;

  @Exclude({ toPlainOnly: true })
  @IsNotEmpty()
  @IsString()
  @Column({
    transformer: {
      from(value) {
        return value;
      },
      to(value) {
        var salt = bcrypt.genSaltSync(10);
        var hash = bcrypt.hashSync(value);
        return hash;
      },
    },
  })
  password: string;

  @IsString()
  @IsNotEmpty()
  @Column({ type: 'text' })
  role: UserRole;
}
