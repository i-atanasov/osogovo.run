module.exports = {
  // ...existing config
  plugins: [
    // ...existing plugins
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
      process: 'process/browser',
    })
  ]
}