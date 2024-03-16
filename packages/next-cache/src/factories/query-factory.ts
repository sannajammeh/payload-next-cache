import { type Payload } from "payload";
import type { GetPayload } from "../utils/types";

type FindType = Payload["find"];
export type FindArgs = Parameters<FindType>[0];

export function _findFactory(getPayload: GetPayload): FindType {
  const find: FindType = async (args) => {
    const payload = await getPayload();
    const data = await payload.find(args);
    return data;
  };

  return find;
}

export type FindByIDArgs = Parameters<Payload["findByID"]>[0];

type FindByIDType = Payload["findByID"];

export function _findByIDFactory(getPayload: GetPayload): FindByIDType {
  const findById: FindByIDType = async (args) => {
    const payload = await getPayload();
    const data = await payload.findByID(args);
    return data;
  };

  return findById;
}

export type GlobalArgs = Parameters<Payload["findGlobal"]>[0];

type FindGlobalType = Payload["findGlobal"];
export function _findGlobalFactory(getPayload: GetPayload): FindGlobalType {
  const findGlobal: FindGlobalType = async (args) => {
    const payload = await getPayload();
    const data = await payload.findGlobal(args);
    return data;
  };

  return findGlobal;
}
