import { defineConfig } from 'vitepress';
import {name, description, repository, license, author } from '../../package.json';
import typedocSidebar from '../api/typedoc-sidebar.json';

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: name,
  description,
  base: `/${name.replace('@sgratzl/', '')}/`,
  useWebFonts: false,
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Examples', link: '/markdown-examples' },
      { text: 'API', link: '/api/' },
    ],

    sidebar: [
      {
        text: 'Examples',
        items: [
          { text: 'Markdown Examples', link: '/markdown-examples' },
          { text: 'Runtime API Examples', link: '/api-examples' },
        ],
      },
      {
        text: 'API',
        items: typedocSidebar,
      },
    ],

    socialLinks: [{ icon: 'github', link: repository.url.replace('.git', '') }],

    footer: {
      message: `Released under the <a href="${repository.url.replace(
        '.git',
        ''
      )}/tree/main/LICENSE">${license} license</a>.`,
      copyright: `Copyright © 2019-present <a href="${author.url}">${author.name}</a>`,
    },

    editLink: {
      pattern: `${repository.url.replace('.git', '')}/edit/main/docs/:path`,
    },

    search: {
      provider: 'local',
    },
  },
});
