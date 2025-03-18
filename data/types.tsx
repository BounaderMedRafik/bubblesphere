import { ReactNode } from "react";

export type linkTypeProps = {
  link: string;
  text: string;
  icon: ReactNode;
};

export type SupaUser = {
  userid: string;
  created_at: string;
  name: string;
  username: string;
  pfp: string;
  bio?: string;
  location?: string;
  banner?: string;
  englishLevel?: string;
};

export type SupaPost = {
  postid: string;
  created_at: string;
  userid: string;
  content: string;
  title: string;
  thumbnail?: string;
  niech: string;
};

export type SupaFollow = {
  followid: string;
  created_at: string;
  userid: string;
  followeduserid: string;
};
