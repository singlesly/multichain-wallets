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
          { text: 'Introduction', link: 'get-started/introduction' },
          { text: 'Install', link: '/get-started/docker-compose' },
          { text: 'Wallet encryption', link: 'get-started/wallet-encryption' }
        ],
      },
      {
        text: 'API',
        collapsed: true,
        items: [
          { text: 'API', link: '/api/api' }
        ]
      },
      {
        text: 'Configuration',
        collapsed: true,
        items: [
          { text: 'Environment Variables', link: '/configuration/environment' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/singlesly/multichain-wallets' }
    ]
  }
})
