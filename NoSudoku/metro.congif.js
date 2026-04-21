const { getDefaultConfig } = require('expo/metro-config');
const config = getDefaultConfig(__dirname);
config.resolver.sourceExts.push('jsx', 'js', 'ts', 'tsx'); // Add jsx here
module.exports = config;