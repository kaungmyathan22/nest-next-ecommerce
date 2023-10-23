import { Logger, NotFoundException } from "@nestjs/common";
import {
  Document,
  FilterQuery,
  Model,
  SaveOptions,
  Types,
  UpdateQuery,
} from "mongoose";
import { PaginatedParamsDto } from "src/common/dto/paginated-query.dto";
export abstract class AbstractRepository<TDocument extends Document> {
  protected abstract readonly logger: Logger;

  constructor(protected readonly model: Model<TDocument>) {}

  async create(
    document: Omit<TDocument, "_id">,
    options?: SaveOptions
  ): Promise<TDocument> {
    const createdDocument = new this.model({
      ...document,
      _id: new Types.ObjectId(),
    });
    return (
      await createdDocument.save(options)
    ).toJSON() as unknown as TDocument;
  }

  async findOne(filterQuery: FilterQuery<TDocument>): Promise<TDocument> {
    const document = await this.model.findOne(filterQuery);

    if (!document) {
      this.logger.warn("Document not found with filterQuery", filterQuery);
      throw new NotFoundException("Document not found.");
    }

    return document as TDocument;
  }

  async findOneAndUpdate(
    filterQuery: FilterQuery<TDocument>,
    update: UpdateQuery<TDocument>
  ) {
    const document = await this.model.findOneAndUpdate(filterQuery, update, {
      new: true,
    });

    if (!document) {
      this.logger.warn(`Document not found with filterQuery:`, filterQuery);
      throw new NotFoundException("Document not found.");
    }

    return document;
  }

  async upsert(
    filterQuery: FilterQuery<TDocument>,
    document: Partial<TDocument>
  ) {
    return this.model.findOneAndUpdate(filterQuery, document, {
      lean: true,
      upsert: true,
      new: true,
    });
  }

  async find(filterQuery: FilterQuery<TDocument>) {
    return this.model.find(filterQuery, {}, { _id: 0, __v: 0 }).lean();
  }

  async remove(filterQuery: FilterQuery<TDocument>) {
    return this.model.deleteOne(filterQuery, {});
  }

  async findAllWithPaginated(
    queryParams: PaginatedParamsDto,
    filterQuery: FilterQuery<TDocument> = {}
  ) {
    const { page = 1, pageSize = 10 } = queryParams as PaginatedParamsDto;
    const skip = (page - 1) * pageSize;
    const [totalItems, documents] = await Promise.all([
      this.model.countDocuments(filterQuery),
      this.model.find(filterQuery).limit(pageSize).skip(skip).lean(),
    ]);
    const totalPages = Math.ceil(totalItems / pageSize);
    return {
      prevPage: page > 1 ? page - 1 : null,
      nextPage: page >= totalPages ? null : +page + 1,
      totalPages: +totalPages,
      totalItems: +totalItems,
      page: +page,
      pageSize: +pageSize,
      data: documents,
    };
  }
}
