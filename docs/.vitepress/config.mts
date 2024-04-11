import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Multichain",
  description: "Interact with Web3 blockchain networks easily",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Docs', link: '/get-started/docker-compose' }
    ],

    sidebar: [
      {
        text: 'Getting Started',
        collapsed: true,
        items: [
          { text: 'docker compose', link: '/get-started/docker-compose' },
        ],
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/singlesly/multichain-wallets' }
    ]
  }
})
