/// <reference types="vite-plugin-svgr/client" />

declare module '*.svg' {
  import React = require('react')
  export const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement>>
  const src: string
  export default src
}

declare type Nullable<T> = T | null
