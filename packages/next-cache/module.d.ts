declare module "@payload-config" {
  import { type SanitizedConfig } from "payload/config";

  declare const config: Promise<SanitizedConfig>;
  export default config;
}

declare module "server-only";
