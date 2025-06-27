import { Test, TestingModule } from '@nestjs/testing';
import { ReimbursementsController } from './reimbursements.controller';
import { ReimbursementsService } from './reimbursements.service';

describe('ReimbursementsController', () => {
  let controller: ReimbursementsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReimbursementsController],
      providers: [ReimbursementsService],
    }).compile();

    controller = module.get<ReimbursementsController>(ReimbursementsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
