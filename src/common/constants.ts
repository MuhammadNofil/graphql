export const BASE_URL = process.env.BASE_URL || 'https://www.nuvomint.com';
export const PINATA_GATEWAY_URL: string = 'https://gateway.pinata.cloud/ipfs';
// export const GRAPH_API_KEY = process.env.GRAPH_API_KEY || '0efb1d92bd5ac3b6fdca2f844dd796e9';
export const GRAPH_API_KEY = process.env.GRAPH_API_KEY || 'bec04f91fc937cf5ec33417ce5f9cdc4';
export const BACKEND_URL = process.env.BACKEND_URL || 'https://dev-backend.nuvomint.com';
export const SUPER_RARE_GRAPH_URL = `https://gateway.thegraph.com/api/${GRAPH_API_KEY}/subgraphs/id/8QaCygBoQ3XsQq8XxF1i6HPYTUHFFhHB9vrF3KvdRXST`;
export const FOUNDATION_GRAPH_URL = `https://gateway.thegraph.com/api/${GRAPH_API_KEY}/subgraphs/id/33mhqfVG26N2V8pGNoEpnF5pSr2LbLg8VQRy7PL5EydY`;
export const ERC_721_GRAPH_URL = `https://gateway.thegraph.com/api/${GRAPH_API_KEY}/subgraphs/id/BEkzgsGPhih7VE6aVwUL4h7EZyXJjZYn16T9PE5XCmou`;
export const OPENSEA_v1_GRAPH_URL = `https://gateway.thegraph.com/api/${GRAPH_API_KEY}/subgraphs/id/2t4T7bts8ZQCpGcVq9VSzDyPVCQc5Y7TFwZKfmXKeSVx`;
export const OPENSEA_v2_GRAPH_URL = `https://gateway.thegraph.com/api/${GRAPH_API_KEY}/subgraphs/id/AwoxEZbiWLvv6e3QdvdMZw4WDURdGbvPfHmZRc8Dpfz9`;
export enum TOKEN_TYPE {
  ORGANIZATION_INVITE = 'organization_invite',
  FORGET_PASSWORD = 'FORGET_PASSWORD',
  IMAGE_UPLOAD = 'IMAGE_UPLOAD',
  ACCOUNT_VERIFICATION = 'ACCOUNT_VERIFICATION',
  LOGIN = 'LOGIN',
}

export enum DEFAULT_PAGINATION {
  PAGE = 0,
  PAGE_SIZE = 10,
}

export enum GROUP_INVITE_ACCEPT_REJECT {
  ACCEPT = 'ACCEPT',
  REJECT = 'REJECT',
}

export enum NOTIFICATION_TYPE {
  PROFILE = 'PROFILE',
  NFT = 'NFT',
  NFTVIEW = 'NFTVIEW',
  NFTIMPRESSION = 'NFTIMPRESSION',
  USER = 'USER',
  LIKE = 'LIKE',
  GROUPS = 'GROUPS',
  WALLET = 'WALLET',
  FOLLOW = 'FOLLOW',
  COMMENT = 'COMMENT',
  RATENFT = 'RATENFT',
  FEEDBACK = 'FEEDBACK',
  ANALYTICS = 'ANALYTICS',
  REPORTNFT = 'REPORTNFT',
  GROUPPOST = 'GROUPPOST',
  NOTIFICATON = 'NOTIFICATION',
  GROUPINVITE = 'GROUPINVITE',
  GROUPMEMBER = 'GROUPMEMBER',
  REPORTGROUP = 'REPORTGROUP',
  COMMENTLIKE = 'COMMENTLIKE',
  BLOCKPROFILE = 'BLOCKPROFILE',
  REPORTPROFILE = 'REPORTPROFILE',
  SOCIALPROFILE = 'SOCIALPROFILE',
  COMMENTREPLIES = 'COMMENTREPLIES',
  INVITEACCEPTED = 'INVITEACCEPTED',
}

export enum BADGES {
  NO_BADGE = `0`,
  BEGGINER = `500`,
  SEMI_PRO = `1500`,
  MASTER = `3000`,
  SUPER_USER = `5000`,
  KING = `10000`,
}

export enum MESSAGE {
  LIKE = `liked`,
  COMMENT = 'Commented',
  RATEARTWORK = 'rated your artwork',
}

export enum TITLE {
  LIKE,
  COMMENT,
  RATEARTWORK,
}

export const notificationMessageBuilder = {
  comment: (userName: string) => {
    return `${userName} commented on your Artwork`;
  },
  commentLike: (userName: string) => {
    return `${userName} liked your comment`;
  },
  commentReply: (userName: string) => {
    return `${userName} replied to your comment on your Artwork`;
  },

  follow: (userName: string) => {
    return `${userName} started following you`;
  },

  like: (userName: string) => {
    return `${userName} liked your Artwork`;
  },
  invite: (userName: string, groupname: string) => {
    return `${userName} invited you to his group: ${groupname}`;
  },
  inviteAccepted: (userName: string, groupname: string) => {
    return `${userName} accepted your invitation to group: ${groupname}`;
  },

  rate: (userName: string) => {
    return `${userName} rated your Artwork`;
  },
};
