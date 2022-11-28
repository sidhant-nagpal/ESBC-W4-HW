import { Body, Controller, Get, Post } from '@nestjs/common';
import { VotingTokenService } from './votingToken.service';

export class claimTokensDto {
  address: string;
}

@Controller('token')
export class VotingTokenController {
  constructor(private readonly votingTokenService: VotingTokenService) {}

  @Get('token-address')
  getTokenContractAddress(): { result: string } {
    return this.votingTokenService.getTokenContractAddress();
  }

  @Post('claim-tokens')
  claimTokens(
    @Body() claimTokensDto: claimTokensDto,
  ): Promise<{ result: string }> {
    return this.votingTokenService.claimTokens(claimTokensDto.address);
  }
}
