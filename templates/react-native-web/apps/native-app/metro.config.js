// Learn more https://docs.expo.io/guides/customizing-metro
const { withNativeWind } = require('nativewind/metro');
const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

const workspaceRoot = path.resolve(__dirname, "../..");
const projectRoot = __dirname;

const config = getDefaultConfig(projectRoot);

config.watchFolders = [workspaceRoot];
config.resolver.nodeModulesPaths = [
    path.resolve(projectRoot, "node_modules"),
    path.resolve(workspaceRoot, "node_modules")
];

config.resolver.disableHierarchicalLookup = true;

module.exports = withNativeWind(config, { input: './globals.css' });