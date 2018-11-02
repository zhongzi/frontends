declare type Query = { [k: string]: any }

declare interface QueryUtil {
  parse (query: string): Query
  from (query: Query): string
}

declare const query: QueryUtil
export default query
