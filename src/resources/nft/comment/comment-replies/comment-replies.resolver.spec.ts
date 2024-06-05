import { Test, TestingModule } from '@nestjs/testing';
import { CommentRepliesResolver } from './comment-replies.resolver';
import { CommentRepliesService } from './comment-replies.service';

describe('CommentRepliesResolver', () => {
  let resolver: CommentRepliesResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CommentRepliesResolver, CommentRepliesService],
    }).compile();

    resolver = module.get<CommentRepliesResolver>(CommentRepliesResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
