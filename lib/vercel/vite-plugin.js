import {existsSync} from 'node:fs';
import {cp, mkdir, rm, writeFile} from 'node:fs/promises';
import {dirname, join} from 'node:path';
import {fileURLToPath} from 'node:url';

const PLUGIN_DIR = dirname(fileURLToPath(import.meta.url));

const VIRTUAL_ENTRY_ID = 'virtual:impetus-vercel/entry';
const RESOLVED_VIRTUAL_ENTRY_ID = '\0virtual:impetus-vercel/entry';

/**
 * Vite plugin: builds Hydrogen for Vercel Functions (Node.js), not Edge.
 *
 * @param {{
 *   serverEntry?: string;
 *   runtime?: string;
 *   memory?: number;
 *   maxDuration?: number;
 *   regions?: string[];
 *   streaming?: boolean;
 *   debug?: boolean;
 * }} [options]
 * @returns {import('vite').Plugin[]}
 */
export function vercel(options = {}) {
  const {
    serverEntry = './server.js',
    runtime = 'nodejs22.x',
    memory,
    maxDuration,
    regions,
    streaming = true,
    debug = false,
  } = options;

  let root = process.cwd();
  let isSsr = false;
  let assetsDir = 'assets';

  return [
    {
      name: 'impetus-vercel:config',
      config(_, {isSsrBuild}) {
        isSsr = Boolean(isSsrBuild);
        if (!isSsrBuild) return;

        return {
          build: {
            rollupOptions: {
              input: VIRTUAL_ENTRY_ID,
              output: {entryFileNames: 'index.js'},
            },
          },
          ssr: {
            noExternal: true,
            resolve: {
              // Prefer worker/browser conditions so React uses renderToReadableStream
              conditions: ['workerd', 'worker', 'browser'],
            },
          },
        };
      },
      configResolved(config) {
        root = config.root;
        assetsDir = config.build.assetsDir;

        if (isSsr) {
          const entryPath = join(config.root, serverEntry);
          if (!existsSync(entryPath)) {
            throw new Error(
              `impetus-vercel: serverEntry not found at "${serverEntry}" (${entryPath})`,
            );
          }
        }
      },
    },
    {
      name: 'impetus-vercel:entry',
      resolveId(id) {
        if (id === VIRTUAL_ENTRY_ID) return RESOLVED_VIRTUAL_ENTRY_ID;
      },
      load(id) {
        if (id !== RESOLVED_VIRTUAL_ENTRY_ID) return;

        const resolvedServerEntry = join(root, serverEntry).replace(
          /\\/g,
          '/',
        );
        const adapterImportPath = join(PLUGIN_DIR, 'node-adapter.js').replace(
          /\\/g,
          '/',
        );

        return [
          `import handler from '${resolvedServerEntry}';`,
          `import { createVercelHandler } from '${adapterImportPath}';`,
          `export default createVercelHandler(handler, { debug: ${debug} });`,
        ].join('\n');
      },
    },
    {
      name: 'impetus-vercel:output',
      enforce: 'post',
      apply: 'build',
      closeBundle: {
        sequential: true,
        order: 'post',
        async handler() {
          if (!isSsr) return;

          const dist = join(root, 'dist');
          const output = join(root, '.vercel/output');

          if (
            !existsSync(join(dist, 'server')) ||
            !existsSync(join(dist, 'client'))
          ) {
            throw new Error(
              'impetus-vercel: dist/server or dist/client missing after build.',
            );
          }

          await rm(output, {recursive: true, force: true});
          await mkdir(join(output, 'functions/index.func'), {recursive: true});
          await mkdir(join(output, 'static'), {recursive: true});

          await cp(join(dist, 'client'), join(output, 'static'), {
            recursive: true,
          });
          await cp(join(dist, 'server'), join(output, 'functions/index.func'), {
            recursive: true,
          });

          /** @type {Record<string, unknown>} */
          const vcConfig = {
            runtime,
            handler: 'index.js',
            launcherType: 'Nodejs',
            supportsResponseStreaming: streaming,
          };
          if (memory) vcConfig.memory = memory;
          if (maxDuration) vcConfig.maxDuration = maxDuration;
          if (regions) vcConfig.regions = regions;

          await writeFile(
            join(output, 'functions/index.func/.vc-config.json'),
            JSON.stringify(vcConfig, null, 2),
          );

          await writeFile(
            join(output, 'functions/index.func/package.json'),
            JSON.stringify({type: 'module'}, null, 2),
          );

          await writeFile(
            join(output, 'config.json'),
            JSON.stringify(
              {
                version: 3,
                routes: [
                  {
                    src: `^/${assetsDir}/(.*)$`,
                    headers: {
                      'Cache-Control': 'public, max-age=31536000, immutable',
                    },
                    continue: true,
                  },
                  {src: '^.*\\.map$', status: 404},
                  {handle: 'filesystem'},
                  {src: '/(.*)', dest: '/index'},
                ],
              },
              null,
              2,
            ),
          );

          console.log(
            `impetus-vercel: wrote .vercel/output (runtime=${runtime}, streaming=${streaming})`,
          );
        },
      },
    },
  ];
}
