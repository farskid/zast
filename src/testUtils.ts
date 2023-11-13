import { Zast } from "./babel/zast";
import babel from "@babel/parser";

export function getTestBabelInstance(fileContent: string) {
  const z = new Zast({
    fileContent,
  });
  const file = babel.parse(fileContent);
  return { z, file };
}
