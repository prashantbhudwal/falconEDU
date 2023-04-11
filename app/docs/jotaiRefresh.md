Jotai refresh plugin does not work for now. 

The issue under review. 
- https://github.com/pmndrs/swc-jotai/issues/6
- https://github.com/vercel/next.js/issues/46989

Will have to add the change the config file after it works.

How to configure: https://jotai.org/docs/tools/swc

## TODO 
Change next config: 

module.exports = {
  experimental: {
    swcPlugins: [['@swc-jotai/react-refresh', {}]],
  },
}
  