// Type declarations for static assets so TypeScript won't error when importing
// CSS and images in Vite + React projects.
declare module '*.css'
declare module '*.scss'
declare module '*.sass'
declare module '*.less'
declare module '*.png'
declare module '*.jpg'
declare module '*.jpeg'
declare module '*.gif'
declare module '*.svg'
declare module '*.webp'

// If you use CSS modules, you can narrow the typing further, for example:
// declare module '*.module.css' {
//   const classes: { readonly [key: string]: string }
//   export default classes
// }
