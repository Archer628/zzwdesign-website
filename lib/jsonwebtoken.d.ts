declare module "jsonwebtoken" {
  export function sign(
    payload: string | object | Buffer,
    secretOrPrivateKey: string,
    options?: {
      expiresIn?: string | number
      notBefore?: string | number
      audience?: string | string[]
      issuer?: string
      jwtid?: string
      subject?: string
      noTimestamp?: boolean
      header?: object
      encoding?: string
    }
  ): string

  export function verify(
    token: string,
    secretOrPublicKey: string,
    options?: {
      audience?: string | string[]
      issuer?: string | string[]
      ignoreExpiration?: boolean
      ignoreNotBefore?: boolean
      subject?: string
      clockTolerance?: number
      maxAge?: string | number
      clockTimestamp?: number
    }
  ): any

  export function decode(
    token: string,
    options?: { complete?: boolean; json?: boolean }
  ): null | { [key: string]: any } | string
}
