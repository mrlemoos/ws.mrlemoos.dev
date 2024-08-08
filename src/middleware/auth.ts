import { H3Event } from "h3";

import { useAPIToken } from "~/lib/env";
import { suppressPrefix } from "~/lib/strings";

function canBearAuthorizationToken(
  headerValue: string
): headerValue is `Bearer ${string}` {
  return headerValue.startsWith("Bearer ");
}

function getAuthorizationHeader(event: H3Event):
  | {
      token: `Bearer ${string}`;
      error?: never;
    }
  | {
      token?: never;
      error: string;
    } {
  const header = getRequestHeader(event, "Authorization");
  if (!header) {
    return {
      error:
        "Authorization header is missing. Please provide a valid token to access this resource.",
    };
  }

  if (!canBearAuthorizationToken(header)) {
    return {
      error:
        'Authorization header does not contain a valid prefix. Please assure that the token is prefixed with "Bearer".',
    };
  }

  return {
    token: header,
  };
}

async function respondWithUnauthorized(
  event: H3Event,
  authenticationError: string
): Promise<void> {
  return await event.respondWith(
    new Response(
      JSON.stringify({
        error: authenticationError,
      }),
      {
        status: 401,
        statusText: "Unauthorized",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
  );
}

function hasPermissionToProceed(_event: H3Event, token: string): boolean {
  const apiToken = useAPIToken();
  const tokenWithoutBearer = suppressPrefix(token, "Bearer ");

  return (
    typeof apiToken === "string" &&
    tokenWithoutBearer.trim() === apiToken.trim()
  );
}

function canBypassRoute(event: H3Event): boolean {
  const requestURL = getRequestURL(event);
  const { pathname } = requestURL;
  return pathname.startsWith("/_") || pathname.startsWith("_");
}

export default defineEventHandler(async (event) => {
  if (canBypassRoute(event)) {
    return;
  }

  const { token, error: tokenNotFoundError } = getAuthorizationHeader(event);

  if (tokenNotFoundError) {
    return await respondWithUnauthorized(event, tokenNotFoundError);
  }

  if (!hasPermissionToProceed(event, token)) {
    return await respondWithUnauthorized(
      event,
      "The provided bearer token does not satisfy the OVH accepted by the service. Please review the authorization header and try again."
    );
  }

  // injects the token into the context if we need it for any reason...
  event.context.token = token;
});
