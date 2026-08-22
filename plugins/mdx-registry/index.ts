import { NextConfig } from "next";
import { TurbopackRuleConfigItem } from "next/dist/server/config-shared";

const VIRTUAL_SPECIFIER = "virtual:mdx-registry";
const STUB_FILE = "mdx-registry.stub.ts";

export function createMdxRegistry(options: { pattern: string | string[] }): (config: NextConfig) => NextConfig {
  const loaderPath = require.resolve("./loader/index.mjs");
  const stubPath = `./plugins/mdx-registry/${STUB_FILE}`;

  return (config: NextConfig) => {
    config.turbopack ??= {};

    config.turbopack.resolveAlias ??= {};
    config.turbopack.resolveAlias[VIRTUAL_SPECIFIER] = stubPath;

    config.turbopack.rules ??= {};
    config.turbopack.rules[STUB_FILE] ??= {};

    const rules = config.turbopack.rules[STUB_FILE] as TurbopackRuleConfigItem;
    rules.loaders ??= [];
    rules.loaders.push({
      loader: loaderPath,
      options,
    });

    return config;
  };
}
