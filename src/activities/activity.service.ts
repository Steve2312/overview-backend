import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Activity } from './activity.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ActivityService {
  constructor(
    @InjectRepository(Activity)
    private activityRepository: Repository<Activity>,
  ) {}

  async findAll() {
    return await this.activityRepository.find();
  }

  async findById(id: number) {
    return await this.activityRepository.findOneOrFail({
      id: id,
    });
  }

  async findByDate(date: string) {
    const activities = await this.findAll();
    return activities.filter((activity) => {
      return activity.date == date;
    });
  }

  async getDates() {
    const query = `
        SELECT date,
        COUNT(*) "total",
        COUNT(finished) FILTER (where finished = false) "remaining"
        FROM activity
        GROUP BY date
        ORDER BY date ASC;
    `;
    const dates = await this.activityRepository.query(query);
    return dates.map((data) => {
      data.date = data.date.split('T')[0];
      data.total = parseInt(data.total);
      data.remaining = parseInt(data.remaining);
      return data;
    });
  }

  async update(id: number, activity: Activity) {
    await this.activityRepository.update(id, activity);
    return await this.findById(id);
  }

  async add(activity: Activity) {
    const { identifiers } = await this.activityRepository.insert(activity);
    return await this.findById(identifiers[0].id);
  }

  async delete(id: number) {
    await this.activityRepository.delete({
      id: id,
    });
  }
}
