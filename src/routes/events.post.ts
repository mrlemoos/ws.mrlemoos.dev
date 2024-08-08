import { H3Event } from "h3";
import { type infer as Infer, z } from "zod";
import { transformErrorToRequestBody } from "~/lib/errors";

import { httpMethodSchema } from "~/lib/http";
import log from "~/lib/log";
import { isObject } from "~/lib/objects";

const webSocketEventSchema = z.object({
  event: z.string(),
  data: z.any().optional(),
});
type WebSocketEventSchema = Infer<typeof webSocketEventSchema>;

const httpEventSchema = z.object({
  method: httpMethodSchema,
  url: z.string(),
  headers: z.record(z.string(), z.string()).optional(),
  data: z.union([z.string(), z.record(z.string(), z.any())]).optional(),
});
type HttpEventSchema = Infer<typeof httpEventSchema>;

const pushEventSchema = z.union([webSocketEventSchema, httpEventSchema]);
type PushEventSchema = Infer<typeof pushEventSchema>;

function parseEventResponseBody<T>(body: T):
  | {
      data: PushEventSchema;
      error?: never;
    }
  | {
      data?: never;
      error: string;
    } {
  try {
    const data = pushEventSchema.parse(body);
    return {
      data,
    };
  } catch (error) {
    return transformErrorToRequestBody(error);
  }
}

async function sendHttpEvent<T>(
  _event: H3Event,
  data: HttpEventSchema
): Promise<T> {
  const { method, url, headers, data: body } = data;
  const response = await $fetch(url, {
    method,
    headers,
    body: typeof body === "string" ? body : JSON.stringify(body),
  });

  return response as T;
}

function isPushEventHttpKind(data: PushEventSchema): data is HttpEventSchema {
  return isObject(data) && "method" in data;
}

function isPushEventWebSocketKind(
  data: PushEventSchema
): data is WebSocketEventSchema {
  return isObject(data) && "event" in data;
}

async function sendWebsocketEvent(
  event: H3Event,
  data: WebSocketEventSchema
): Promise<{ error?: string }> {
  try {
    const eventSource = createEventStream(event);
    const message = isObject(data) ? JSON.stringify(data) : data;

    eventSource.push(message).then(log.info).catch(log.error);
    return {};
  } catch (error) {
    return transformErrorToRequestBody(error);
  }
}

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { data, error: parseError } = parseEventResponseBody(body);

  appendResponseHeader(event, "Content-Type", "application/json");
  appendResponseHeader(event, "X-Timestamp", new Date().toISOString());

  if (parseError) {
    setResponseStatus(event, 400, "Bad Request");
    return {
      error: parseError,
    };
  }

  if (isPushEventHttpKind(data)) {
    return await sendHttpEvent(event, data);
  }

  if (isPushEventWebSocketKind(data)) {
    return await sendWebsocketEvent(event, data);
  }

  return {
    error: "Invalid event type",
  };
});
