import { Route } from 'vue-router'

declare type Params = { [k: string]: any }

declare interface NextRoute {
  build (current: Route): string
  get (route: { next: string|Route, params?: Params, query?: Params}): Route
}

declare const nextRoute: NextRoute
export default nextRoute
