import { Injectable } from '@nestjs/common';
import { GraphQLClient, gql } from 'graphql-request';
import { SUPER_RARE_GRAPH_URL } from 'src/common/constants';

@Injectable()
export class SuperRareGqlService extends GraphQLClient {
  constructor() {
    super(SUPER_RARE_GRAPH_URL, {});
  }
  /**
   * @param  {number=0} skip
   * @param  {number=20} first
   */
  async fetchArtWorks(skip: number = 0, first: number = 20) {
    // console.log(SUPER_RARE_GRAPH_URL);
    console.log(
      '🚀 ~ file: super-rare-gql.service.ts:16 ~ SuperRareGqlService ~ fetchArtWorks ~ SUPER_RARE_GRAPH_URL',
      SUPER_RARE_GRAPH_URL,
    );
    const query = gql`
      query ArtWorks($skip: Int, $first: Int) {
        artworks(skip: ${skip}, first: ${first}) {
          created
          tokenId
          currentBid
          descriptorUri
          descriptorHash
          found
          id
          lastSoldPrice
          modified
        }
      }
    `;
    const response = await this.request(query);
    return response?.artworks;
  }
}
