
// ZAF does not ship w/ the client types. By (sloppily) typing it here,
// we can use TS in this file w/ ignoring errors.
export type IZafClient = {
  on(topic: string, arg1: (e: any) => void): void
  invoke: (...params: any) => void
  request: (...params: any) => Promise<any>
  metadata: (...params: any) => Promise<any>
  get: (...params: any) => Promise<any>
}