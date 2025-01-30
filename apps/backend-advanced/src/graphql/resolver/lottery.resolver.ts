import {
  Args,
  Field,
  Int,
  Mutation,
  ObjectType,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { LotteryCreateDTO } from 'src/lottery/dtos/lottery-create.dto';
import { LotteryListDTO } from 'src/lottery/dtos/lottery-list.dto';
import { Lottery } from 'src/lottery/entities/lottery.entity';
import { LotteryService } from 'src/lottery/services/lottery/lottery.service';
import { OperatorAuthentication } from 'src/operator/decorators/operator-authentication.decorator';
import { Operator } from 'src/operator/entities/operator.entity';
import { OperatorService } from 'src/operator/services/operator/operator.service';

@ObjectType()
export class LotteryListResult {
  @Field(() => [Lottery], { nullable: true })
  lotteries: Lottery[];

  @Field(() => Int)
  count: number;
}

@Resolver(() => Lottery)
export class LotteryResolver {
  constructor(
    private lotteryService: LotteryService,
    private operatorService: OperatorService,
  ) {}

  @Query(() => LotteryListResult)
  lotteries(
    @Args('criteria', { type: () => LotteryListDTO, nullable: true })
    criteria: LotteryListDTO,
    @Args('limit', { type: () => Int })
    limit: number,
    @Args('page', { type: () => Int }) page: number,
  ) {
    return this.lotteryService.findAll(criteria, {
      limit,
      page,
    });
  }

  @Query(() => Lottery)
  lottery(@Args('id', { type: () => String }) id: string) {
    return this.lotteryService.findOne({ id });
  }

  @ResolveField('createdBy', () => Operator, {
    name: 'createdBy',
    nullable: true,
  })
  async getCreatedBy(@Parent() lottery: Lottery) {
    if (!lottery.createdByOperatorId) {
      return null;
    }
    try {
      return await this.operatorService.findOne({
        id: lottery.createdByOperatorId,
      });
    } catch (e) {
      return null;
    }
  }

  @ResolveField('closedBy', () => Operator, {
    name: 'closedBy',
    nullable: true,
  })
  async getClosedBy(@Parent() lottery: Lottery) {
    if (!lottery.closedByOperatorId) {
      return null;
    }
    try {
      return await this.operatorService.findOne({
        id: lottery.closedByOperatorId,
      });
    } catch (e) {
      return null;
    }
  }

  @OperatorAuthentication()
  @Mutation(() => Lottery)
  createLottery(
    @Args('lotteryCreateDTO', { type: () => LotteryCreateDTO })
    data: LotteryCreateDTO,
  ) {
    return this.lotteryService.create(data);
  }
}
