import { NextConfig } from "next";
import { TurbopackRuleConfigItem } from "next/dist/server/config-shared";

const REGISTRY_SPECIFIER = "virtual:mdx-registry";
const REGISTRY_STUB = "mdx-registry.stub.ts";
const COMPONENTS_SPECIFIER = "virtual:mdx-components";
const COMPONENTS_STUB = "mdx-components.stub.ts";
const SOURCE_SPECIFIER = "virtual:mdx-source";
const SOURCE_STUB = "mdx-source.stub.ts";

export function createMdxRegistry(options: {
  pattern: string | string[];
  exclude?: string | string[];
}): (config: NextConfig) => NextConfig {
  const loaderPath = require.resolve("./loader/index.mjs");
  const registryStub = `./plugins/mdx-registry/${REGISTRY_STUB}`;
  const componentsStub = `./plugins/mdx-registry/${COMPONENTS_STUB}`;
  const sourceStub = `./plugins/mdx-registry/${SOURCE_STUB}`;

  return (config: NextConfig) => {
    config.turbopack ??= {};

    config.turbopack.resolveAlias ??= {};
    config.turbopack.resolveAlias[REGISTRY_SPECIFIER] = registryStub;
    config.turbopack.resolveAlias[COMPONENTS_SPECIFIER] = componentsStub;
    config.turbopack.resolveAlias[SOURCE_SPECIFIER] = sourceStub;

    config.turbopack.rules ??= {};
    config.turbopack.rules[REGISTRY_STUB] ??= {};
    config.turbopack.rules[COMPONENTS_STUB] ??= {};
    config.turbopack.rules[SOURCE_STUB] ??= {};

    const registryRule = config.turbopack.rules[REGISTRY_STUB] as TurbopackRuleConfigItem;
    registryRule.loaders ??= [];
    registryRule.loaders.push({
      loader: loaderPath,
      options,
    });

    const componentsRule = config.turbopack.rules[COMPONENTS_STUB] as TurbopackRuleConfigItem;
    componentsRule.loaders ??= [];
    componentsRule.loaders.push({
      loader: loaderPath,
      options: { ...options, mode: "components" },
    });

    const sourceRule = config.turbopack.rules[SOURCE_STUB] as TurbopackRuleConfigItem;
    sourceRule.loaders ??= [];
    sourceRule.loaders.push({
      loader: loaderPath,
      options: { ...options, mode: "source" },
    });

    return config;
  };
}
