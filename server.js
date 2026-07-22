import * as serverBuild from 'virtual:react-router/server-build';
import {createRequestHandler, storefrontRedirect} from '@shopify/hydrogen';
import {waitUntil as vercelWaitUntil} from '@vercel/functions';
import {createHydrogenRouterContext} from '~/lib/context';

/**
 * On Oxygen, env comes from Workers bindings.
 * On Vercel Node, fall back to process.env.
 * @param {Env | undefined} env
 * @returns {Env}
 */
function resolveEnv(env) {
  if (env?.SESSION_SECRET) return env;
  return /** @type {Env} */ (process.env);
}

/**
 * On Oxygen, waitUntil comes from ExecutionContext.
 * On Vercel, use @vercel/functions waitUntil.
 * @param {ExecutionContext | undefined} executionContext
 * @returns {ExecutionContext}
 */
function resolveExecutionContext(executionContext) {
  if (executionContext?.waitUntil) return executionContext;

  return /** @type {ExecutionContext} */ ({
    waitUntil: (promise) => {
      vercelWaitUntil(promise);
    },
    passThroughOnException() {},
  });
}

/**
 * Export a fetch handler in Workers module format.
 * Local MiniOxygen and the Vercel Node adapter both support this shape.
 */
export default {
  /**
   * @param {Request} request
   * @param {Env} [env]
   * @param {ExecutionContext} [executionContext]
   * @return {Promise<Response>}
   */
  async fetch(request, env, executionContext) {
    try {
      const resolvedEnv = resolveEnv(env);
      const resolvedContext = resolveExecutionContext(executionContext);

      const hydrogenContext = await createHydrogenRouterContext(
        request,
        resolvedEnv,
        resolvedContext,
      );

      const handleRequest = createRequestHandler({
        build: serverBuild,
        mode: process.env.NODE_ENV,
        getLoadContext: () => hydrogenContext,
      });

      const response = await handleRequest(request);

      if (hydrogenContext.session.isPending) {
        response.headers.set(
          'Set-Cookie',
          await hydrogenContext.session.commit(),
        );
      }

      if (response.status === 404) {
        return storefrontRedirect({
          request,
          response,
          storefront: hydrogenContext.storefront,
        });
      }

      return response;
    } catch (error) {
      console.error(error);
      return new Response('An unexpected error occurred', {status: 500});
    }
  },
};
