import { Test, TestingModule } from '@nestjs/testing';
import { CommentLikeResolver } from './comment-like.resolver';
import { CommentLikeService } from './comment-like.service';

describe('CommentLikeResolver', () => {
  let resolver: CommentLikeResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CommentLikeResolver, CommentLikeService],
    }).compile();

    resolver = module.get<CommentLikeResolver>(CommentLikeResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
