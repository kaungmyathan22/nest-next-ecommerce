import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { PaginatedParamsDto } from "src/common/dto/paginated-query.dto";
import { ProductService } from "src/product/services/product.service";
import { User } from "src/users/schemas/user.schema";
import { CreateOrderDto } from "./dto/create-order.dto";
import { UpdateOrderStatusDto } from "./dto/update-order-status.dto";
import { Order } from "./schemas/order.schema";

@Injectable()
export class OrderService {
  constructor(
    private readonly productService: ProductService,
    @InjectModel(Order.name)
    private OrderModel: Model<Order>
  ) {}
  async create(user: User, { proudctItems }: CreateOrderDto) {
    const orderItems = [];
    for (let index = 0; index < proudctItems.length; index++) {
      const productItem = proudctItems[index];
      const product = await this.productService.findOne(productItem.id);
      if (!product) {
        throw new BadRequestException("Invalid product id provided");
      }
      const sizes = [];
      const colours = [];
      for (let index = 0; index < productItem.sizes.length; index++) {
        const sizeId = productItem.sizes[index];
        const size = product.sizes.find((siz) => siz.id === sizeId);
        if (!size) {
          throw new BadRequestException("Invalid size provided");
        }
        sizes.push(size);
      }

      for (let index = 0; index < productItem.colours.length; index++) {
        const colourId = productItem.colours[index];
        const colour = product.colours.find((colour) => colour.id === colourId);
        if (!colour) {
          throw new BadRequestException("Invalid colour provided");
        }
        colours.push(colour);
      }

      orderItems.push({
        productName: product.title,
        productPrice: product.price,
        quantity: productItem.quantity,
        ...(sizes.length > 0 ? { sizes } : {}),
        ...(colours.length > 0 ? { colours } : {}),
      });
    }
    const order = new this.OrderModel({
      user: user._id,
      orderItems,
    });

    await order.save();
    return order;
  }

  async getAllOrders(queryParams: PaginatedParamsDto) {
    const { page = 1, pageSize = 10 } = queryParams;
    const skip = (page - 1) * pageSize;
    const [totalItems, orders] = await Promise.all([
      this.OrderModel.countDocuments(),
      this.OrderModel.find().limit(pageSize).skip(skip),
    ]);
    const totalPages = Math.ceil(totalItems / pageSize);
    return {
      prevPage: page > 1 ? page - 1 : null,
      nextPage: page >= totalPages ? null : +page + 1,
      totalPages: +totalPages,
      totalItems: +totalItems,
      page: +page,
      pageSize: +pageSize,
      data: orders,
    };
  }

  async getAllOrdersOfLoggedInUser(
    user: User,
    queryParams: PaginatedParamsDto
  ) {
    const { page = 1, pageSize = 10 } = queryParams;
    const skip = (page - 1) * pageSize;
    const [totalItems, orders] = await Promise.all([
      this.OrderModel.countDocuments({ user: user._id }),
      this.OrderModel.find({ user: user._id }).limit(pageSize).skip(skip),
    ]);
    const totalPages = Math.ceil(totalItems / pageSize);
    return {
      prevPage: page > 1 ? page - 1 : null,
      nextPage: page >= totalPages ? null : +page + 1,
      totalPages: +totalPages,
      totalItems: +totalItems,
      page: +page,
      pageSize: +pageSize,
      data: orders,
    };
  }

  async findOne(id: string) {
    const order = await this.OrderModel.findById(id);
    if (!order) {
      throw new NotFoundException("Order with given is not found.");
    }
    return order;
  }

  async updateOrderStatus(id: string, { status }: UpdateOrderStatusDto) {
    const result = await this.OrderModel.findOneAndUpdate(
      { _id: id },
      { orderStatus: status },
      { new: true }
    );
    return result;
  }
}
