import * as z from "zod"
import { AppEnvZod } from '../zod/AppEnv';

/** 新增记录 */
export const AppEnvZodCreate = AppEnvZod.omit({
  id: true,
  canDelete: true,
  appVersionId: true,
  version: true,
  isDeleted: true,
})

/** 新增记录<类型> */
export type AppEnvDtoCreate = z.infer<typeof AppEnvZodCreate>
