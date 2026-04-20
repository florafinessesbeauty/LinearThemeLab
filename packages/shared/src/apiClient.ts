export interface ApiClientOptions {
  baseUrl: string;
  token?: string;
}

export class ApiClient {
  constructor(private opts: ApiClientOptions) {}

  private headers() {
    return this.opts.token
      ? { Authorization: `Bearer ${this.opts.token}`, "Content-Type": "application/json" }
      : { "Content-Type": "application/json" };
  }

  async health() {
    const res = await fetch(`${this.opts.baseUrl}/health`);
    return res.json();
  }

  async generateTheme(body: unknown) {
    const res = await fetch(`${this.opts.baseUrl}/themes/generate`, {
      method: "POST",
      headers: this.headers(),
      body: JSON.stringify(body)
    });
    if (!res.ok) throw new Error(`Generate failed: ${res.status}`);
    return res.json();
  }
}
