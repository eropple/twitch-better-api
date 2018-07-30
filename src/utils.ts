import * as ChangeCase from "change-case";
import { DateTime } from "luxon";

export function transformTwitchResponse(obj: { [key: string]: any }) {
  const ret: { [key: string]: any } = {};

  for (const key of Object.keys(ret)) {
    const fixedKey = ChangeCase.camelCase(key);
    ret[fixedKey] = obj[key];

    const v = obj[key];
    if (key.endsWith("_at")) {
      ret[fixedKey] = DateTime.fromISO(obj[key]);
    } else {
      ret[fixedKey] = obj[key];
    }
  }

  return ret;
}
