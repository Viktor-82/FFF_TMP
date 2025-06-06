// const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');
//
// /**
//  * Metro configuration
//  * https://reactnative.dev/docs/metro
//  *
//  * @type {import('metro-config').MetroConfig}
//  */
// const config = {
//     transformer: {
//         babelTransformerPath: require.resolve('react-native-svg-transformer'),
//         resetCache: true,
//     },
//     resolver: {
//         assetExts: getDefaultConfig(__dirname).resolver.assetExts.filter(ext => ext !== 'svg'),
//         sourceExts: [...getDefaultConfig(__dirname).resolver.sourceExts, 'svg', 'jsx', 'js', 'ts', 'tsx'],
//     },
// };
//
// module.exports = mergeConfig(getDefaultConfig(__dirname), config);

const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {
    transformer: {
        babelTransformerPath: require.resolve('react-native-svg-transformer'),
        resetCache: true,
        getTransformOptions: async () => ({
            transform: {
                experimentalImportSupport: false,
                inlineRequires: false, // Отключает оптимизацию для корректной пересборки
            },
        }),
    },
    resolver: {
        assetExts: getDefaultConfig(__dirname).resolver.assetExts.filter(ext => ext !== 'svg'),
        sourceExts: [...getDefaultConfig(__dirname).resolver.sourceExts, 'svg', 'jsx', 'js', 'ts', 'tsx'],
    },
    cacheStores: [], // Отключает кеширование в Metro
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
