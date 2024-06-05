import { Test, TestingModule } from '@nestjs/testing';
import { GroupInviteController } from './group-invite.controller';

describe('GroupInviteController', () => {
  let controller: GroupInviteController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GroupInviteController],
    }).compile();

    controller = module.get<GroupInviteController>(GroupInviteController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
