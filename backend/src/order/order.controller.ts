import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import JwtAuthenticationGuard from "src/authentication/guards/jwt.guard";
import { CurrentUser } from "src/common/decorators/current-user.decorator";
import { ObjectIdValidationPipe } from "src/common/pipes/object-id-validation.pipe";
import { PaginationQueryParamsValidationPipe } from "src/common/pipes/pagination-query-params-validation.pipe";
import { User } from "src/users/schemas/user.schema";
import { CreateOrderDto } from "./dto/create-order.dto";
import { UpdateOrderStatusDto } from "./dto/update-order-status.dto";
import { OrderService } from "./order.service";

@UseGuards(JwtAuthenticationGuard)
@Controller("api/v1/order")
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  create(@Body() payload: CreateOrderDto, @CurrentUser() user: User) {
    return this.orderService.create(user, payload);
  }

  @Get()
  getOrders(@Query(new PaginationQueryParamsValidationPipe()) query) {
    return this.orderService.getAllOrders(query);
  }

  @Get("my-orders")
  getOrdersOfLoggedInUser(
    @Query(new PaginationQueryParamsValidationPipe()) query,
    @CurrentUser() user: User
  ) {
    return this.orderService.getAllOrdersOfLoggedInUser(user, query);
  }

  @Get(":id")
  findOne(@Param("id", ObjectIdValidationPipe) id: string) {
    return this.orderService.findOne(id);
  }

  @Patch(":id")
  updateOrderStatus(
    @Param("id", ObjectIdValidationPipe) id: string,
    @Body() payload: UpdateOrderStatusDto
  ) {
    return this.orderService.updateOrderStatus(id, payload);
  }
}
