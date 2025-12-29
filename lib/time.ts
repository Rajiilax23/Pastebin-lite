export function now(req?: Request): number {
  if (process.env.TEST_MODE === "1") {
    const testNow = req?.headers.get("x-test-now-ms");
    if (testNow) {
      return Number(testNow);
    }
  }
  return Date.now();
}
