/** This file defines a functional interface to Google's Generative Language REST API. */

export interface RiddleModel {
  question: string
  correctAnswer: string
  incorrectAnswers: Array<string>
}

interface GenerateTextRequest {
  prompt: { text: string }
  maxOutputTokens: number
  temperature: number
}

interface GenerateTextResponse {
  candidates: Array<{ output: string }>
}

interface GenerateRiddlesRequest {
  topic: string
  numRiddles: number
  numIncorrectOptions: number
}

export default class GenerativeLanguageService {

  private static baseUrl_ = 'https://generativelanguage.googleapis.com/v1beta2'

  static get(apiKey: string): GenerativeLanguageService {
    return new GenerativeLanguageService(apiKey)
  }

  private apiKey_: string

  private constructor(apiKey: string) {
    this.apiKey_ = apiKey
  }

  /** Generates riddles! */
  async generateRiddles(props: GenerateRiddlesRequest): Promise<Array<RiddleModel>> {
    // console.debug(`generateRiddles Request: ${JSON.stringify(props)}`)

    const prompt = [
      `I want to quiz my friend on the topic of "${props.topic}".`,
      `Can you list ${props.numRiddles} short questions and their word or phrase answers, together with up to ${props.numIncorrectOptions} other answers that are incorrect but reasonable?`,
      `Output in JSON with fields: question, correctAnswer, incorrectAnswers.`,
    ].join('\n')

    const req: GenerateTextRequest = {
      maxOutputTokens: 2048,
      prompt: { text: prompt },
      temperature: .05,
    }
    const respPromise: Promise<GenerateTextResponse> = this.doPost_('/models/text-bison-001:generateText', { key: this.apiKey_ }, req)
    return respPromise.then((resp) => {
      const str = resp.candidates![0].output
      // console.debug(`generateRiddles Response: ${str}`)
      return this.toJson_(str)
    })
  }

  private toJson_(str: string) {
    str = str.replaceAll('\n', '')
    if (str.startsWith('```json')) {
      // Strip out code start.
      str = str.substring(7)
      console.debug('Stripped JSON code start.')
      if (str.endsWith('```')) {
        // Strip out code end.
        str = str.slice(0, -3)
        console.debug('Stripped JSON code end.')
      }
    }
    if (str.indexOf('""') > 0) {
      str = str.replaceAll('""', '"')
      console.debug('De-duped double quotes.')
    }
    if (str.indexOf("''") > 0) {
      str = str.replaceAll("''", "'")
      console.debug('De-duped single quotes.')
    }
    if (!str.endsWith('}]')) {
      const lastAnswer = str.lastIndexOf('},')
      const ignored = str.substring(lastAnswer)
      str = str.substring(0, lastAnswer) + '}]'
      console.debug(`Truncated answers, ignored: ${ignored}`)
    }
    return JSON.parse(str)
  }

  private async doPost_<RequestType, ResponseType>(endpoint: string, params: any, req: RequestType): Promise<ResponseType> {
    const url = this.generateUrl_(endpoint, params)
    return fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req),
    }).then(async (resp) => {
      if (resp.ok) {
        return resp.json()
      } else {
        return resp.text().then((body) => Promise.reject(`Error (${resp.status}): ${body}`))
      }
    })
  }

  private generateUrl_(endpoint: string, params: any): string {
    return `${GenerativeLanguageService.baseUrl_}${endpoint}?${this.encodeParams_(params)}`
  }

  private encodeParams_(params: any): string {
    return Object.entries(params).map(([key, value]) => {
      if (!value) {
        return ''
      }
      return `${key}=${encodeURIComponent('' + value)}`
    }).join("&")
  }
}