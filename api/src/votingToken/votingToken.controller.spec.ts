import { Test, TestingModule } from '@nestjs/testing';
import { VotingTokenController } from './votingToken.controller';
import { VotingTokenService } from './votingToken.service';

describe('AppController', () => {
  let votingTokenController: VotingTokenController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [VotingTokenController],
      providers: [VotingTokenService],
    }).compile();

    votingTokenController = app.get<VotingTokenController>(
      VotingTokenController,
    );
  });

  describe('root', () => {
    it('should return token contract address', () => {
      expect(votingTokenController.getTokenContractAddress()).toBe(
        '0xF6e8FF785bA56C14DeE6056d457e2F78DB868Ece',
      );
    });
  });
});
