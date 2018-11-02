import VueRouter from 'vue-router'

declare module 'vue-router/types/router' {
  interface VueRouter {
    buildNext (from: any): void
    pushWithNext (route: any, onComplete?: Function, onAbort?: Function, from?: any): void
    replaceWithNext (route: any, onComplete?: Function, onAbort?: Function, from?: any): void
    pushRawNext (config: any, onComplete?: Function, onAbort?: Function): void
    pushNext (current: any, replace?: boolean, onComplete?: Function, onAbort?: Function): void
  }
}

declare function patch(router: any): void
export default patch
