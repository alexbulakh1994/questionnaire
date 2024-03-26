export type AuthConfig = {
  secret: {
    access_token: string;
    refresh_token: string;
  };
  expired: {
    access_token: number;
    refresh_token: number;
  };
};
