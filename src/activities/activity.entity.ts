import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Activity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({
    nullable: true,
  })
  description: string;

  @Column({
    default: false,
  })
  finished: boolean;

  @Column({
    nullable: true,
  })
  googleMapsUrl: string;

  @Column({
    transformer: {
      from(value: string): string {
        const date = new Date(value);
        const timezoneOffset = date.getTimezoneOffset() * 60000;
        return new Date(date.getTime() - timezoneOffset)
          .toISOString()
          .split('T')[0];
      },
      to(value: string): Date {
        const date = new Date(value);
        date.setHours(0, 0, 0, 0);
        return date;
      },
    },
  })
  date: string;
}
