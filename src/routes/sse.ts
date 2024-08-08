export default defineEventHandler(async (event) => {
  const eventStream = createEventStream(event);

  eventStream.push({
    event: "connected",
    data: JSON.stringify({
      address: event.context.clientAddress,
    }),
  });

  eventStream.onClosed(async () => {
    await eventStream.close();
  });

  return eventStream.send();
});
