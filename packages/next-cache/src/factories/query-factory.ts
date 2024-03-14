import { type Payload } from "payload";
import type { GetPayload } from "../utils/types";

export type FindArgs = Parameters<Payload["find"]>[0];

export function _findFactory(getPayload: GetPayload) {
  const find: Payload["find"] = async (args) => {
    const payload = await getPayload();
    const data = await payload.find(args);
    return data;
  };

  return find;
}

export type FindByIDArgs = Parameters<Payload["findByID"]>[0];

export function _findByIDFactory(getPayload: GetPayload) {
  const findById: Payload["findByID"] = async (args) => {
    const payload = await getPayload();
    const data = await payload.findByID(args);
    return data;
  };

  return findById;
}

export type GlobalArgs = Parameters<Payload["findGlobal"]>[0];
export function _findGlobalFactory(getPayload: GetPayload) {
  const findGlobal: Payload["findGlobal"] = async (args) => {
    const payload = await getPayload();
    const data = await payload.findGlobal(args);
    return data;
  };

  return findGlobal;
}
