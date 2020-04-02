const nodeExternals = require('webpack-node-externals')
module.exports = {
  webpack: (config, _options, _webpack) => {
    config.entry.main = './server/index.ts'
    config.resolve = {
      extensions: ['.ts', '.js', '.json']
    }
    config.module.rules.push({
      test: /\.ts$/,
      loader: 'awesome-typescript-loader'
    })
    config.externals = [nodeExternals()]

    return config
  }
}
