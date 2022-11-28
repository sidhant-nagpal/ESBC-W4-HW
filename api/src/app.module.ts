import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { VotingTokenModule } from './votingToken/votingToken.module';

@Module({
  imports: [VotingTokenModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
