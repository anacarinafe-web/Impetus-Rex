/**
 * Node.js HTTP ↔ Web Request/Response bridge for Vercel Functions.
 * Supports Workers-style `{ fetch }` modules (Hydrogen/Oxygen) and plain handlers.
 */
import {createRequest, sendResponse} from '@mjackson/node-fetch-server';

/**
 * @param {((request: Request) => Response | Promise<Response>) | {fetch: (request: Request) => Response | Promise<Response>}} handler
 * @param {{debug?: boolean}} [options]
 * @returns {(req: import('node:http').IncomingMessage, res: import('node:http').ServerResponse) => Promise<void>}
 */
export function createVercelHandler(handler, options = {}) {
  const debug = options.debug ?? false;
  const handleRequest =
    typeof handler === 'function' ? handler : handler.fetch.bind(handler);

  return async (req, res) => {
    const startTime = Date.now();
    const url = req.url || '/';

    if (debug) {
      console.log(`[impetus-vercel] ${req.method} ${url}`);
    }

    try {
      const request = createRequest(req, res, {
        protocol: `${req.headers['x-forwarded-proto'] || 'https'}:`,
        host: req.headers['x-forwarded-host'] || req.headers.host,
      });

      const response = await handleRequest(request);
      await sendResponse(res, response);

      if (debug) {
        console.log(
          `[impetus-vercel] ${response.status} ${url} (${Date.now() - startTime}ms)`,
        );
      }
    } catch (error) {
      console.error(`[impetus-vercel] Error: ${req.method} ${url}`, error);
      if (!res.headersSent) {
        res.statusCode = 500;
        res.end('An unexpected error occurred');
      } else {
        res.end();
      }
    }
  };
}
