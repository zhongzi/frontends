type SwiftParams = { [k: string]: any }

export interface SwiftAPI {
  list (payload: { query: SwiftParams, headers: SwiftParams, args: any, configs?: SwiftParams }): Promise<any>
  get (payload: { id: string|number|void, query: SwiftParams, headers: SwiftParams, args: any, configs?: SwiftParams }): Promise<any>
  create (payload: { res: any, query: SwiftParams, headers: SwiftParams, args: any, configs?: SwiftParams }): Promise<any>
  update (payload: { res: any, id: string|number|void, query: SwiftParams, headers: SwiftParams, args: any, configs?: SwiftParams }): Promise<any>
  delete (payload: { res: any, query: SwiftParams, headers: SwiftParams, args: any, configs?: SwiftParams }): Promise<any>
}

declare function resource(api: any, plural: string, filters?: Array<Function>): SwiftAPI

export default resource
