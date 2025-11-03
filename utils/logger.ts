/* eslint-disable @typescript-eslint/no-explicit-any */

const isDev = __DEV__;

export const logger = {
  info(message: string, ...args: any[]) {
    if (isDev) {
      console.log(`[INFO] ${message}`, ...args);
    }
  },

  warn(message: string, ...args: any[]) {
    if (isDev) {
      console.warn(`[WARN] ${message}`, ...args);
    }
  },

  error(message: string, error?: Error, ...args: any[]) {
    if (isDev) {
      console.error(`[ERROR] ${message}`, error, ...args);
    }
    // In production, send to Sentry or other logging service
  },

  debug(message: string, ...args: any[]) {
    if (isDev) {
      console.debug(`[DEBUG] ${message}`, ...args);
    }
  },
};

