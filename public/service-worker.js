/**
 *   register for PUSH, baby
 */
self.addEventListener("push", async (event) => {
  const jsonData = await event.data.json();

  const { title, body } = jsonData;
  try {
    await self.registration.showNotification(title, {
      body,
    });
  } catch(err) {
    console.error(err);
  }
  
});
