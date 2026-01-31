/**
 * 静态资源路径：在 GitHub Pages 等带 basePath 的部署下自动加前缀，本地开发无前缀。
 * 用于 next/image 的 src，确保图片在项目站（xxx.github.io/仓库名）下能正确加载。
 */
const base = typeof process !== "undefined" ? process.env.NEXT_PUBLIC_BASE_PATH ?? "" : "";

export function asset(path: string): string {
  return path.startsWith("http") ? path : `${base}${path}`;
}
