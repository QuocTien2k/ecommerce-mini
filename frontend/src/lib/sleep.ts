export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const ensureMinDelay = async (
  startTime: number,
  minDuration: number,
) => {
  const elapsed = Date.now() - startTime;
  if (elapsed < minDuration) {
    await sleep(minDuration - elapsed);
  }
};
