import { Injectable } from '@nestjs/common';
import { gql, GraphQLClient } from 'graphql-request';
import {ERC_721_GRAPH_URL } from 'src/common/constants';

@Injectable()
export class ERC_721_GqlService extends GraphQLClient{
    constructor() {
        super(ERC_721_GRAPH_URL, {});
      }

      async fetchArtWorks(skip: number = 0, first: number = 20) {
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
        console.log(
          '🚀 ~ file: super-rare-gql.service.ts:29 ~ SuperRareGqlService ~ fetchApolloClient ~ response',
          response,
        );
        return response;
      }
}
