import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Pagination } from 'src/common/types/pagination.type';
import { OperatorRegisterDTO } from 'src/operator/dtos/operator-register.dto';
import { Operator } from 'src/operator/entities/operator.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { OperatorAuthService } from '../operator-auth/operator-auth.service';
import { ConfigType } from '@nestjs/config';
import configuration from 'src/config/configuration';
import { OperatorAuth } from 'src/operator/entities/operator-auth.entity';

@Injectable()
export class OperatorService {
  constructor(
    @InjectRepository(Operator)
    private operatorRepository: Repository<Operator>,
    @InjectRepository(OperatorAuth)
    private operatorAuthRepository: Repository<OperatorAuth>,
    private operatorAuthService: OperatorAuthService,
    @Inject(configuration.KEY)
    private configService: ConfigType<typeof configuration>,
  ) {
    this.setup();
  }

  async setup() {
    const operators = await this.findAll({}, { page: 1, limit: 1 });
    if (operators.total === 0) {
      const defaultOperator = this.register({
        name: 'Default Operator',
        email: this.configService.defaults.operator.email,
        password: this.configService.defaults.operator.password,
      });
    }
  }

  async findAll(
    criteria: FindOptionsWhere<Operator>,
    pagination: Pagination,
  ): Promise<{
    operators: Operator[];
    total: number;
  }> {
    const [operators, total] = await this.operatorRepository.findAndCount({
      where: criteria,
      take: pagination.limit,
      skip: (pagination.page - 1) * pagination.limit,
    });
    return { operators, total };
  }

  async findOne(criteria: FindOptionsWhere<Operator>): Promise<Operator> {
    const operator = await this.operatorRepository.findOne({ where: criteria });

    if (!operator) {
      throw new NotFoundException('Operator not found');
    }

    return operator;
  }

  async register(data: OperatorRegisterDTO): Promise<Operator> {
    const operatorExists = await this.operatorRepository.findOne({
      where: { email: data.email },
    });

    if (operatorExists) {
      throw new ConflictException('Operator already exists');
    }

    const operator = new Operator();
    operator.name = data.name;
    operator.email = data.email;
    operator.auth = await this.operatorAuthService.generate(
      data.email,
      data.password,
    );

    await this.operatorRepository.save(operator);

    operator.auth.operatorId = operator.id;
    await this.operatorAuthRepository.save(operator.auth);

    return operator;
  }
}
