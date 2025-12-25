type State = "CLOSED" | "OPEN" | "HALF_OPEN";

class circuitBreaker {
  private failureCount = 0;
  private state: State = "CLOSED";
  private lastFailureTime = 0;
  private readonly failureThreshold = 3;
  private readonly resetTimeout = 10000;

  async call(fn: () => Promise<any>) {
    if (this.state === "OPEN") {
      if (Date.now() - this.lastFailureTime > this.resetTimeout) {
        this.state = "HALF_OPEN";
      } else {
        throw new Error("Circuit breaker is open");
      }
    }

    try {
      const result = await fn();
      this.failureCount = 0;
      this.state = "CLOSED";
      return result;
    } catch (err) {
      this.failureCount++;
      this.lastFailureTime = Date.now();
      if (this.failureCount >= this.failureThreshold) {
        this.state = "OPEN";
      }
      throw err;
    }
  }
}
