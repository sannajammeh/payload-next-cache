import 'server-only'

import { findByID, findGlobal, findMany, findOne } from './payloadRscClient'
import { getPayload } from './get-payload'

export const payloadRSC = {
  find: findMany,
  findByID: findByID,
  findOne: findOne,
  findGlobal: findGlobal,
  getPayload: getPayload,
}
