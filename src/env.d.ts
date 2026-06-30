/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly CONTENT_SOURCE?: 'fixture' | 'live';
  readonly GH_TOKEN?: string;
  readonly GH_OWNER?: string;
  readonly GH_REPO?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
