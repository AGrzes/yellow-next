//import { Options } from '@mdx-js/loader'
import simplePlantUML from '@akebifiky/remark-simple-plantuml'
import historyFallback from 'connect-history-api-fallback'
import debug from 'debug'
import { static as $static, Handler, Router } from 'express'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import { join } from 'path'
import { cwd } from 'process'
import remarkFrontmatter from 'remark-frontmatter'
import remarkGfm from 'remark-gfm'
import remarkMdxFrontmatter from 'remark-mdx-frontmatter'
import webpack from 'webpack'
import webpackMiddleware from 'webpack-dev-middleware'

const log = debug('yellow:adbs:documents:server')
/* The Webpack configuration is much too complex to be meaningfully unit tested. */
/* c8 ignore start */
export class DocumentsHandler {
  public readonly handler: Handler
  constructor(private router: Router) {
    const documentDirectory = 'documents'
    this.router.use(historyFallback())
    this.router.use('/documents', $static(join(cwd(), documentDirectory)))
    this.router.use(
      webpackMiddleware(
        webpack({
          mode: 'development',
          optimization: {
            usedExports: true,
            innerGraph: true,
          },
          entry: async () => {
            return {
              main: { import: '@agrzes/yellow-next-web', dependOn: ['react'] },
              react: ['react', 'react-dom'],
            }
          },
          resolve: {
            modules: [
              new URL('../../../node_modules/@agrzes/yellow-next-web/node_modules', import.meta.url).pathname,
              'node_modules',
            ],
            alias: {
              '@documents': join(cwd(), documentDirectory),
              '@components': join(cwd(), 'components'),
              '@config': join(cwd(), 'config'),
            },
            extensions: ['.js', '.json', '.wasm', '.mdx'],
          },
          resolveLoader: {
            modules: [new URL('../../../node_modules', import.meta.url).pathname, 'node_modules'],
          },
          module: {
            rules: [
              {
                test: /\.js$/,
                enforce: 'pre',
                use: ['source-map-loader'],
              },
              {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader /*, 'style-loader'*/, 'css-loader', 'postcss-loader'],
              },
              {
                test: /\.scss$/,
                use: ['style-loader', 'css-loader', 'sass-loader'],
              },
              {
                test: /\.(png|svg|jpg|gif)$/,
                use: ['file-loader'],
              },
              {
                test: /\.mdx?$/,
                use: [
                  {
                    loader: '@mdx-js/loader',
                    /** @type {import('@mdx-js/loader').Options} */
                    options: {
                      remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter, remarkGfm, simplePlantUML],
                    }, //as Options,
                  },
                ],
              },
              {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                resolve: {
                  extensions: ['.ts', '.tsx', '.wasm', '.mjs', '.js', '.json', '.mdx'],
                },
                options: {
                  transpileOnly: true,
                },
              },
            ],
          },
          ignoreWarnings: [/Failed to parse source map/],
          plugins: [
            new MiniCssExtractPlugin(),
            new HtmlWebpackPlugin({
              templateContent: `<!DOCTYPE html>
  <html>
    <head>
      <script src="/config"></script>
    </head>
    <body>
      <div id="root"></div>
    </body>
  </html>`,
              chunks: ['main', 'react'],
              base: '/',
            }),
          ],
        }),
        { index: 'index.html' }
      )
    )
    this.handler = this.router
  }
}
