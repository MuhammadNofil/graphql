import { Injectable } from '@nestjs/common';
import { JsonHelperService } from '../json-helper/json-helper.service';
import { SuperRareGqlService } from '../super-rare-gql/super-rare-gql.service';
import { CompressionHelperService } from '../compression-helper/compression-helper.service';
import { FileService } from '../file/file.service';
import { PrismaService } from '../prisma/prisma.service';
import { NFT_TYPE } from '@prisma/client';

@Injectable()
export class QueryHandlerService {
  constructor(
    private readonly jsonHelperService: JsonHelperService,
    private readonly compressionHelper: CompressionHelperService,
    private readonly file: FileService,
    private readonly prisma: PrismaService,
  ) {}
  async SuperRareGqlService(
    data: {
      created: string;
      tokenId: string;
      currentBid: string;
      descriptorUri: string;
      found: boolean;
      id: string;
      lastSoldPrice: any;
      modified: any;
    }[],
  ) {
    const superRareProfile = await this.prisma.profile.findFirst({
      where: {
        user: {
          email: 'admin@superrare.com',
          deleted: false,
        },
        deleted: false,
      },
    });
    const superRareWallet = await this.prisma.wallet.findFirst({
      where: {
        user: {
          email: 'admin@superrare.com',
          deleted: false,
        },
        deleted: false,
      },
    });
    for (let i = 0; i < data.length; i++) {
      const entry = data[i];
      console.log('🚀 ~ file: query-handler.service.ts:49 ~ QueryHandlerService ~ entry', entry);
      if (entry.descriptorUri.includes('https://ipfs.pixura.io/')) {
        const info = await this.jsonHelperService.readFile(entry.descriptorUri);
        if (info.media.mimeType === 'image/jpeg' || info.media.mimeType === 'image/png') {
          const compressedImage = await this.compressionHelper.compressImage(info.image, 50);
          //   const upload = await this.file.uploadBufferFile(compressedImage, '/external-nft', info.name, info.mimeType);
          const nft = await this.prisma.nft.upsert({
            where: {
              mediaHash: entry.descriptorUri.split('/')[4],
            },
            create: {
              title: info.name,
              description: info.description,
              image: (
                await this.file.uploadBufferFile(compressedImage, '/external-nft', info.name, info.media.mimeType)
              ).url,
              mediaHash: entry.descriptorUri.split('/')[4],
              blockChain: 'Ethereum',
              category: info.tags,
              profileId: superRareProfile.id,
              walletId: superRareWallet.id,
              type: NFT_TYPE.EXTERNAL,
            },
            update: {},
          });
          console.log('🚀 ~ file: query-handler.service.ts:72 ~ QueryHandlerService ~ nft', nft);
        }
      }
    }
  }
}
