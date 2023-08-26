/** This file defines a functional interface to the frontend service. */

export interface GetRiddlesForTopicRequest {
  topic: string,
  uid: string,
}

export interface RiddlesForTopic {
  ID: string,
  TimestampMillis: number,
  Riddles: Array<RiddleModel>,
}

export interface RiddleModel {
  Question: string
  CorrectAnswer: string
  IncorrectAnswers: Array<string>
  Explanation: string
  CitationURL: string
}

export default class RiddlrApiService {
  static get(): RiddlrApiService {
    return new RiddlrApiService(RiddlrApiService.baseUrlProd_)
  }

  async getRiddlesForTopic(req: GetRiddlesForTopicRequest): Promise<RiddlesForTopic> {
    return this.doPost_('/riddles/getForTopic', req)
      .then(this.parseAsJson_)
  }

  private async doGet_(endpoint: string, params: any): Promise<Response> {
    const url = this.generateUrl_(endpoint, params)
    return fetch(url)
  }

  private async doPost_(endpoint: string, params: any): Promise<Response> {
    const url = this.generateUrl_(endpoint, {})
    return fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: this.encodeParams_(params),
    })
  }

  private generateUrl_(endpoint: string, params: any): string {
    return `${this.baseUrl_}${endpoint}?${this.encodeParams_(params)}`
  }

  private encodeParams_(params: any): string {
    return Object.entries(params).map(([key, value]) => {
      if (!value) {
        return ''
      }
      return `${key}=${encodeURIComponent('' + value)}`
    }).join("&")
  }

  private async parseAsJson_(resp: Response): Promise<any> {
    if (resp.ok) {
      return resp.json()
    } else {
      return resp.text().then((body) => Promise.reject(`Error (${resp.status}): ${body}`))
    }
  }

  private baseUrl_: string

  private constructor(baseUrl: string) {
    this.baseUrl_ = baseUrl
  }

  private static baseUrlProd_ = "https://api.riddlr.yanivian.com"
}