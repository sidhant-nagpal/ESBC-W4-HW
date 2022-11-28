import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { VotingTokenController } from './votingToken.controller';
import { VotingTokenService } from './votingToken.service';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [VotingTokenController],
  providers: [VotingTokenService],
})
export class VotingTokenModule {}
