export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: number;
      MEDIA_FOLDER: string;
      MEDIA_HTML: string;
      media_types: string;
      HELP: string;
      ENV: 'test' | 'dev' | 'prod';
    }
  }
}