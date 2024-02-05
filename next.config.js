/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./env.js");

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,
  images: {
    domains: ["utfs.io"],
  },
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },
};

export default config;
