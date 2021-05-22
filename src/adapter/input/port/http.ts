export interface HttpResponse {
    statusCode: number
    body: unknown
  }

export interface HttpRequest<T> {
    body: T
  }
