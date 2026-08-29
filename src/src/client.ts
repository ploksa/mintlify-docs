import type { ClientOptions, DocumentSummary, Project } from './types.js';

export class DocumentationClient {
  readonly #baseUrl: URL;
  readonly #apiKey: string;

  constructor(options: ClientOptions) {
    this.#baseUrl = new URL(options.baseUrl);
    this.#apiKey = options.apiKey;
  }

  async getProject(projectId: string): Promise<Project> {
    return this.#request<Project>(`v1/projects/${encodeURIComponent(projectId)}`);
  }

  async listDocuments(projectId: string): Promise<DocumentSummary[]> {
    return this.#request<DocumentSummary[]>(
      `v1/projects/${encodeURIComponent(projectId)}/documents`,
    );
  }

  async #request<T>(path: string): Promise<T> {
    const response = await fetch(new URL(path, this.#baseUrl), {
      headers: {
        authorization: `Bearer ${this.#apiKey}`,
        accept: 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    return response.json() as Promise<T>;
  }
}

export function createClient(options: ClientOptions): DocumentationClient {
  return new DocumentationClient(options);
}
