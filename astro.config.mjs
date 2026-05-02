import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://yekku.github.io',
  output: 'static',
  build: {
    format: 'file',
  },
});
