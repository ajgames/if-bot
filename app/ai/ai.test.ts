import { expect, test, describe } from "bun:test";
import { checkEmailImportance } from "./ai";

describe('ai', () => {
  test("Important email is marked important", async () => {
    const email = {
      subject: "Urgent message from your power company"
    };

    const res = await checkEmailImportance(email);
    expect(res.notifyImmediately).toBe(true);
  });

  test("Unimportant email subject line does not notify immediately", async () => {
    const email = {
      subject: "Your amazon order has been placed"
    };

    const res = await checkEmailImportance(email);
    expect(res.notifyImmediately).toBe(false);
  });
})

