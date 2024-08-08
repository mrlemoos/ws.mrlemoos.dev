import log from "~/lib/log";

export default defineWebSocketHandler({
  open(peer) {
    log.info(`WebSocket connection opened from "${peer.addr}"`);
  },
  close(peer, { code, reason }) {
    log.info(
      [
        `WebSocket connection closed from "${peer.addr}".`,
        `Reason: "${code} ${reason}"`,
      ].join("\n")
    );
  },
  error(peer, error) {
    log.error(
      `WebSocket connection error from "${peer.addr}". See the error as follows: "${error.message}"`
    );
  },
  message(peer, message) {
    const text = message.text();

    log.info(
      `WebSocket message received from "${peer.addr}". Message: "${text}"`
    );
  },
});
