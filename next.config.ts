import type { NextConfig } from "next";

const supabaseHost = (() => {
  try {
    return process.env.NEXT_PUBLIC_SUPABASE_URL
      ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
      : undefined;
  } catch {
    return undefined;
  }
})();

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: supabaseHost
      ? [{ protocol: "https", hostname: supabaseHost }]
      : [],
  },
  turbopack: {
    root: __dirname,
  },

  // bu kısım çalışmazsa sil
  output: 'export', // Statik dosyalar oluşturur
  basePath: '/su-kalitesi-web', // https://kullanici.github.io/repo-adiniz
  trailingSlash: true, // URL sonunda / olması için
  images: {
    unoptimized: true, // GitHub Pages'te resim optimizasyonu için gerekli
  },
};

export default nextConfig;
