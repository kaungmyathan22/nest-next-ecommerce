import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { CategoryController } from "./controllers/category.controller";
import { GenderController } from "./controllers/gender.controller";
import { ProductController } from "./controllers/product.controller";
import { Category, CategorySchema } from "./schema/category.schema";
import { GenderDocument, GenderSchema } from "./schema/gender.schema";
import { Product, ProductSchema } from "./schema/product.schema";
import { CategoryService } from "./services/category.service";
import { GenderService } from "./services/gender.service";
import { ProductService } from "./services/product.service";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Product.name, schema: ProductSchema },
      { name: GenderDocument.name, schema: GenderSchema },
      { name: Category.name, schema: CategorySchema },
    ]),
  ],
  controllers: [GenderController, ProductController, CategoryController],
  providers: [ProductService, GenderService, CategoryService],
  exports: [ProductService],
})
export class ProductModule {}
