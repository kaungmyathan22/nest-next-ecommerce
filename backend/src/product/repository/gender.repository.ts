import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AbstractRepository } from 'src/database/abstract.repository';
import { GenderDocument } from '../schema/gender.schema';

@Injectable()
export class GenderRepository extends AbstractRepository<GenderDocument> {
  protected readonly logger = new Logger(GenderRepository.name);

  constructor(
    @InjectModel(GenderDocument.name)
    genderModel: Model<GenderDocument>,
  ) {
    super(genderModel);
  }
}
