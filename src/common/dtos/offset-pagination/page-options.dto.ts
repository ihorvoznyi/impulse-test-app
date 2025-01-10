import { ApiProperty } from '@nestjs/swagger';
import {
  EnumFieldOptional,
  NumberFieldOptional,
} from 'src/app/decorators/field.decorators';
import { Order } from 'src/common/const/app.const';

export const DEFAULT_PAGE_LIMIT = 50;
export const DEFAULT_CURRENT_PAGE = 1;

export class PageOptionsDto {
  @ApiProperty({
    required: false,
    minimum: 1,
    maximum: 1000,
    default: DEFAULT_PAGE_LIMIT,
  })
  @NumberFieldOptional({
    min: 1,
    max: 1000,
    default: DEFAULT_PAGE_LIMIT,
    int: true,
  })
  readonly take?: number = DEFAULT_PAGE_LIMIT;

  @ApiProperty({
    required: false,
    example: 1,
    minimum: 1,
    default: DEFAULT_CURRENT_PAGE,
  })
  @NumberFieldOptional({
    min: 1,
    default: DEFAULT_CURRENT_PAGE,
    int: true,
  })
  readonly page?: number = DEFAULT_CURRENT_PAGE;

  @EnumFieldOptional(() => Order, { default: Order.ASC })
  readonly order?: Order.ASC;

  get offset() {
    return this.page ? (this.page - 1) & this.take : 0;
  }
}
