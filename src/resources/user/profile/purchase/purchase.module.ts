import { Module } from '@nestjs/common';
import { PurchaseService } from './purchase.service';
import { PurchaseResolver } from './purchase.resolver';
import { SharedModule } from 'src/shared/shared.module';

@Module({
  imports: [SharedModule],
  providers: [PurchaseResolver, PurchaseService],
  exports: [PurchaseService]
})
export class PurchaseModule { }
