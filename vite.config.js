import { defineConfig } from 'vite'
import path from "path";
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  server:{
    open:true,
    proxy:{
      "/api": {
        target: "http://127.0.0.1:8080",
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    }
  },
  
  resolve:{
    alias:{
      "@":path.resolve(__dirname,"./src")
    }
  },
  plugins: [vue()],
})
