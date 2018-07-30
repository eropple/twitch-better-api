export interface UpdateChannelRequest {
  status?: string;
  game?: string;
  delay?: string;
  channelFeedEnabled?: boolean;
}

export interface GetTopClipsRequest {
  channel?: string;
  cursor?: string;
  game?: string;
  language?: string;
  limit?: number;
  period?: "day" | "week" | "month" | "all",
  trending?: boolean;
}


export interface GetStreamsRequest {
  communityId?: Array<string>;
  gameId?: Array<string>;
  language?: Array<string>;
  userId?: Array<string>;
  userLogin?: Array<string>;
}

export interface GetVideosRequest {
  id?: Array<string>;
  userId?: string;
  gameId?: string;
}
