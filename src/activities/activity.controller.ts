import {
  Body,
  Catch,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Put,
  Query,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import { Activity } from './activity.entity';
import { ActivityService } from './activity.service';
import { EntityNotFoundError, QueryFailedError } from 'typeorm';
import { TypeOrmExceptionFilter } from '../filters/TypeOrmExceptionFilter';
import { TransformInterceptor } from '../interceptors/transform.interceptor';

@Controller('activities')
@UseFilters(new TypeOrmExceptionFilter())
@Catch(QueryFailedError, EntityNotFoundError)
export class ActivityController {
  constructor(private activityService: ActivityService) {}

  @Get()
  @UseInterceptors(new TransformInterceptor())
  getActivities(@Query() query) {
    if (!query['date']) return this.activityService.findAll();
    return this.activityService.findByDate(query['date']);
  }

  @Get('/dates')
  @UseInterceptors(new TransformInterceptor())
  getDates() {
    return this.activityService.getDates();
  }

  @Get(':id')
  getActivity(@Param('id') id: number) {
    return this.activityService.findById(id);
  }

  @Patch(':id')
  patchActivity(@Param('id') id: number, @Body() activity: Activity) {
    return this.activityService.update(id, activity);
  }

  @Put()
  postActivity(@Body() activity: Activity) {
    return this.activityService.add(activity);
  }

  @Delete(':id')
  deleteActivity(@Param('id') id: number) {
    return this.activityService.delete(id);
  }
}
