import { ObjectId } from "mongodb";

export function getParamNames(f: Function) {
  return f
    .toString()
    .match(/\((.*?)\)/)![1]
    .split(",") // Simple regex to get "name: type" items in signature
    .map((param: string) => param.split("=")[0].trim()); // remove whitespaces
}

export function containsObjectId(array: ObjectId[], objectId: ObjectId): boolean {
  return array.some((o) => o.toString() === objectId.toString());
}

export function withObjectId(array: ObjectId[], objectId: ObjectId): ObjectId[] {
  return array.concat(objectId);
}

export function withoutObjectId(array: ObjectId[], objectId: ObjectId): ObjectId[] {
  return array.filter((o) => o.toString() !== objectId.toString());
}
