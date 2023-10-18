import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ObjectIdValidationPipe } from 'src/common/pipes/object-id-validation.pipe';
import { QueryParamsValidationPipe } from 'src/common/pipes/query-params-validation.pipe';
import { CreateGenderDTO } from '../dto/gender/create-gender.dto';
import { GenderService } from '../services/gender.service';

@Controller('api/v1/product/gender')
export class GenderController {
  constructor(private readonly genderService: GenderService) {}
  @Post()
  createGender(@Body() payload: CreateGenderDTO) {
    return this.genderService.createGender(payload);
  }

  @Patch(':id')
  updateGender(
    @Param('id', ObjectIdValidationPipe) id: string,
    @Body() payload: CreateGenderDTO,
  ) {
    return this.genderService.updateGender(id, payload);
  }

  @Get()
  getGenders(@Query(QueryParamsValidationPipe) queryParams) {
    return this.genderService.getGenders(queryParams);
  }
}
