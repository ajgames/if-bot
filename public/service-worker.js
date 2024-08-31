/**
 *   register for PUSH, baby
 */
self.addEventListener("push", async (event) => {
  const jsonData = await event.data.json();
  console.log(jsonData);
  const { title, body } = jsonData;
  self.registration.showNotification(title, {
    body,
  });
});
