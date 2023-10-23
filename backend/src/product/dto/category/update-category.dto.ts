import { PickType } from "@nestjs/mapped-types";
import { CreateCategoryDTO } from "./create-category.dto";

export class UpdateCategoryDTO extends PickType(CreateCategoryDTO, ["name"]) {}
