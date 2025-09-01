// global.d.ts
declare module "*.jpg?url" {
  const src: string;
  export default src;
}

declare module "*.png?url" {
  const src: string;
  export default src;
}

declare module "*.webp?url" {
  const src: string;
  export default src;
}

declare module "*.css";
