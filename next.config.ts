import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 仅在 CI（GitHub Actions）下做静态导出，本地 build 保留 API 路由
  ...(process.env.CI === "true" && { output: "export" }),
  // 项目站：GITHUB_PAGES_BASE=/仓库名；用户站（xxx.github.io）：GITHUB_PAGES_BASE 留空
  ...(process.env.GITHUB_PAGES_BASE && {
    basePath: process.env.GITHUB_PAGES_BASE,
    assetPrefix: `${process.env.GITHUB_PAGES_BASE}/`,
  }),
};

export default nextConfig;
