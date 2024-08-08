interface EnvironmentVariables {
  readonly NITRO_API_TOKEN: string;
}

declare global {
  namespace ImportMeta {
    interface ImportMetaEnv extends EnvironmentVariables {}
  }
  namespace NodeJS {
    interface ProcessEnv extends EnvironmentVariables {}
  }
}

export {};
