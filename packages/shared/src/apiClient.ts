export interface ApiClientOptions {
  baseUrl: string;
  token?: string;
}

export class ApiClient {
  constructor(private readonly opts: ApiClientOptions) {}

  private headers(): Record<string, string> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json"
  };

  if (this.opts.token) {
    headers.Authorization = `Bearer ${this.opts.token}`;
  }

  return headers;
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

export async function generateThemeFrontend(data: {
  platform: string;
  niche: string;
  goal: string;
}) {
  const res = await fetch("/api/themes/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });

  if (!res.ok) throw new Error("Theme generation failed");

  return res.json();
}
