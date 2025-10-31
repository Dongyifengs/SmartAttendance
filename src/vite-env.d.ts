/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BUILD_DATE: string
  readonly VITE_BUILD_TIMESTAMP: string
  readonly VITE_GIT_HASH: string
  readonly VITE_GIT_FULL_HASH: string
  readonly VITE_COMMIT_MESSAGE: string
  readonly VITE_GITHUB_REPO: string
  readonly VITE_TEXT: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
