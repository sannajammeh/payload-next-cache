import { Payload } from 'payload'
import { getPayload } from './get-payload'

export type FindArgs = Parameters<Payload['find']>[0]

export const find: Payload['find'] = async (args) => {
  const payload = await getPayload()
  const data = await payload.find(args)
  return data
}

export type FindByIDArgs = Parameters<Payload['findByID']>[0]
export const findById: Payload['findByID'] = async (args) => {
  const payload = await getPayload()
  const data = await payload.findByID(args)
  return data
}

export type GlobalArgs = Parameters<Payload['findGlobal']>[0]
export const findGlobal: Payload['findGlobal'] = async (args) => {
  const payload = await getPayload()
  const data = await payload.findGlobal(args)
  return data
}
