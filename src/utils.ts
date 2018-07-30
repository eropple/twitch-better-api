import * as ChangeCase from "change-case";
import { DateTime } from "luxon";

export function transformTwitchResponse<T>(obj: { [key: string]: any }) {
  const ret: { [key: string]: any } = {};

  for (const key of Object.keys(ret)) {
    let fixedKey: string;

    if (key === "_id") {
      fixedKey = "id";
    } else {
      fixedKey = ChangeCase.camelCase(key);
    }

    ret[fixedKey] = obj[key];

    const v = obj[key];
    if (key.endsWith("_at")) {
      ret[fixedKey] = DateTime.fromISO(obj[key]);
    } else if (key === "_id") {
      ret[fixedKey] = obj[key].toString();
    } else {
      ret[fixedKey] = obj[key];
    }
  }

  return ret as T;
}
