// module.exports = {
//   reactStrictMode: true,
// }

// next.config.js
const withMDX = require('@next/mdx')({
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
  extension: /\.(md|mdx)$/,
});
module.exports = withMDX({
  reactStrictMode: true,
  pageExtensions: ["js", "jsx", "tsx", "ts", "md", "mdx"]
})