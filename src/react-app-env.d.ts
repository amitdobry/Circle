/// <reference types="react-scripts" />

declare namespace NodeJS {
  interface ProcessEnv {
    readonly NODE_ENV: 'development' | 'production' | 'test';
    readonly PUBLIC_URL: string;
    readonly REACT_APP_SERVER_URL?: string;
  }
}

declare const process: {
  env: NodeJS.ProcessEnv;
};

// Extend Window interface to allow Buffer and process polyfills
interface Window {
  Buffer: typeof Buffer;
  process: typeof process;
}
