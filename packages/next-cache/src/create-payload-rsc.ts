import "server-only";

import type { SanitizedConfig } from "payload/types";
import { cache } from "react";
import { getPayload as payloadGetter } from "payload";
import {
  findGlobalFactory,
  findManyFactory,
  findOneFactory,
  findByIdFactory,
} from "./factories/rsc-factory";

interface CreatePayloadRscOptions {
  config: SanitizedConfig | Promise<SanitizedConfig>;
}

export const createPayloadRSC = ({ config }: CreatePayloadRscOptions) => {
  const getPayload = cache(async () => {
    return await payloadGetter({ config });
  });

  const getPayloadConfig = cache(async () => {
    return await config;
  });

  const find = findManyFactory(getPayload, getPayloadConfig);
  const findByID = findByIdFactory(getPayload, getPayloadConfig);
  const findOne = findOneFactory(getPayload, getPayloadConfig);
  const findGlobal = findGlobalFactory(getPayload);

  return {
    find,
    findOne,
    findGlobal,
    findByID,
    getPayload,
    getPayloadConfig,
  };
};
