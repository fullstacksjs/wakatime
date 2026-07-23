import { joinPaths } from '@fullstacksjs/toolbox';

export class HttpError extends Error {
  statusCode: number;
  url: string;
  statusMessage?: string;

  constructor(statusCode: number, url: string, statusMessage?: string) {
    super(`HTTP Error ${statusCode} for ${url}: ${statusMessage}`);
    this.statusCode = statusCode;
    this.url = url;
    this.statusMessage = statusMessage;
  }
}

type Header = Record<string, string>;

export class HttpClient {
  baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async request(path: string, options?: RequestInit): Promise<any> {
    const url = path ? joinPaths(this.baseUrl, path) : this.baseUrl;

    try {
      const response = await fetch(url, options);

      if (!response.ok) {
        throw new HttpError(response.status, url, response.statusText);
      }

      const contentType = response.headers.get('content-type');

      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      } else {
        return await response.text();
      }
    } catch (error) {
      throw new HttpError(
        error instanceof HttpError ? error.statusCode : 500,
        url,
        error instanceof Error ? error.message : String(error),
      );
    }
  }

  async get(url: string, { headers }: { headers?: Header } = {}): Promise<any> {
    return this.request(url, {
      method: 'GET',
      headers,
    });
  }

  async post(url: string, { body, headers }: { body?: any; headers?: Header }): Promise<any> {
    return this.request(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async put(url: string, { body, headers }: { body?: any; headers?: Header }): Promise<any> {
    return this.request(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
    });
  }
}
