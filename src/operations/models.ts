import { DateTime } from "luxon";

export interface TwitchChannel {
  mature: boolean;
  status: string;
  broadcasterLanguage: string;
  displayName: string;
  game: string;
  language: string;
  createdAt: DateTime;
  updatedAt: DateTime;
  partner: boolean;
  logo: string;
  videoBanner: string;
  profileBanner?: string;
  profileBannerBackgroundColor?: string;
  url: string;
  views: number;
  followers: number;
  broadcasterType: string;
  streamKey: string;
  email: string;
}
