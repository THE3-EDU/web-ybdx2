This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## 部署到 GitHub Pages

1. **把代码推到 GitHub**  
   仓库需有 `main` 分支（或把 workflow 里的 `branches` 改成你的默认分支）。

2. **开启 GitHub Pages**  
   仓库 → **Settings** → **Pages** → **Build and deployment** → **Source** 选 **GitHub Actions**。

3. **触发部署**  
   推送到 `main` 后会自动构建并部署；也可在 **Actions** 里选 “Deploy to GitHub Pages” 手动 **Run workflow**。

4. **访问地址**  
   - **项目站**（仓库名如 `web-ybdx2`）：`https://<你的用户名>.github.io/web-ybdx2/`  
   - 画画页面：`https://<你的用户名>.github.io/web-ybdx2/show`  
   - 若仓库名是 `xxx.github.io`（用户站），需在 `.github/workflows/deploy-pages.yml` 里把 `GITHUB_PAGES_BASE` 改为 `""`，站点会在 `https://<用户名>.github.io/`。

5. **说明**  
   静态导出不支持 API 路由，部署时 workflow 会先删除 `app/api` 再构建，本地仓库里的 `app/api` 不受影响；若在本地跑 `npm run build` 做静态导出，需先临时移走 `app/api`。
