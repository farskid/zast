import { Zast } from "./babel/zast";
import babel from "@babel/parser";

export function getTestBabelInstance(...args: Parameters<typeof Zast>) {
  const z = Zast(...args);
  const file = babel.parse(args[0].fileContent);
  return { z, file };
}
