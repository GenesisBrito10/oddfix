import { Transform } from 'class-transformer';
import { IsIn, IsNotEmpty, IsString } from 'class-validator';

/**
 * POST /surebets/register body. `type` is normalized to lowercase so the client
 * may send LIVE/PREMATCH or live/prematch; the controller maps it to the enum.
 */
export class RegisterSurebetDto {
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.toLowerCase() : value,
  )
  @IsIn(['live', 'prematch'])
  type: 'live' | 'prematch';

  @IsString()
  @IsNotEmpty()
  snapshotId: string;

  @IsString()
  @IsNotEmpty()
  arbHash: string;
}
