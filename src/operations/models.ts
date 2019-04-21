import { DateTime } from "luxon";

export type MapOf<T> = { [key: string]: T };
export type StringStringMap = MapOf<string>;

export interface KrakenChannel {
  id: string;
  mature: boolean;
  status: string;
  broadcasterLanguage: string;
  displayName: string;
  game: string;
  language: string;
  createdAt: DateTime;
  updatedAt: DateTime;
  partner: boolean;
  logo?: string;
  videoBanner?: string;
  profileBanner?: string;
  profileBannerBackgroundColor?: string;
  url: string;
  views: number;
  followers: number;
  broadcasterType: string;
  streamKey?: string;
  email?: string;
}

export interface KrakenTeam {
  id: string;
  background?: string;
  banner?: string;
  createdAt: DateTime;
  displayName: string;
  info?: string;
  logo?: string;
  name: string;
  updatedAt: DateTime;
}

export interface KrakenCommunity {
  id: string;
  ownerId: string;
  name: string;
  displayName: string;
  avatarImageUrl: string;
  coverImageUrl: string;
  description: string;
  descriptionHtml: string;
  rules: string;
  rulesHtml: string;
  language: string;
  summary: string;
}

export interface KrakenChannelFollower {
  createdAt: DateTime;
  notifications: boolean;
  user: KrakenChannel;
}

export interface KrakenChannelSubscriber {
  id: string;
  createdAt: DateTime;
  subPlan: string;
  subPlanName: string;
  user: KrakenChannel;
}

export interface KrakenVideoChannel {
  id: string;
  displayName: string;
  name: string;
}

export interface KrakenVideoThumbnail {
  type: string;
  url: string;
}

export type KrakenVideoThumbnailMap =
  { [key: string]: Array<KrakenVideoThumbnail> };

export interface KrakenVideo {
  id: string;
  broadcastId: number;
  broadcastType: string;
  channel: KrakenVideoChannel;
  createdAt: DateTime;
  description: string;
  descriptionHtml: string;
  fps: StringStringMap;
  game: string;
  language: string;
  length: number;
  publishedAt?: DateTime;
  resolutions: StringStringMap;
  status: string;
  tag_list?: string;
  thumbnails: KrakenVideoThumbnailMap;
  title: string;
  url: string;
  viewable: string;
  viewableAt?: DateTime;
  views: number;
}

export interface KrakenClipChannel {
  id: string;
  name: string;
  displayName: string;
  channelUrl: string;
  logo?: string;
}

export interface KrakenClipVod {
  id: string;
  url: string;
}

export interface KrakenClip {
  slug: string;
  trackingId: string;
  url: string;
  embedUrl: string;
  embedHtml: string;
  broadcaster: KrakenClipChannel;
  curator: KrakenClipChannel;
  vod: KrakenClipVod;
  game: string;
  language: string;
  title: string;
  views: number;
  duration: number;
  createdAt: DateTime;
  thumbnails: StringStringMap;
}

export interface HelixGame {
  id: string;
  name: string;
  boxArtUrl: string;
}

export interface KrakenGameSearchResult {
  id: string;
  box: StringStringMap,
  giantbombId?: number;
  logo: StringStringMap;
  name: string;
  popularity: number;
}

export interface HelixStream {
  id: string;
  userId: string;
  gameId: string;
  communityIds: Array<string>;
  type: string;
  title: string;
  viewerCount: number;
  startedAt: DateTime;
  language: string;
  thumbnailUrl: string;
}

export interface HelixUser {
  id: string;
  login: string;
  displayName: string;
  type: string;
  broadcasterType: string;
  description: string;
  profileImageUrl?: string;
  offlineImageUrl?: string;
  viewCount: number;
  email?: string;
}

export interface HelixFollow {
  fromId: string;
  fromName: string;
  toId: string;
  toName: string;
  followedAt: DateTime;
}

export interface HelixVideo {
  id: string;
  userId: string;
  title: string;
  description: string;
  createdAt: DateTime;
  publishedAt?: DateTime;
  thumbnailUrl: string;
  viewable: string;
  viewCount: number;
  language: string;
  type: string;
  duration: string;
}
