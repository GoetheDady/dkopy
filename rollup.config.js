import typescript from 'rollup-plugin-typescript2'
import terser from '@rollup/plugin-terser';

export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/index.js',
      format: 'cjs'
    },
    {
      file: 'dist/index.esm.js',
      format: 'es'
    }
  ],
  plugins: [
    typescript({
      useTsconfigDeclarationDir: true,
      tsconfigOverride: {
        compilerOptions: {
          module: "esnext"
        }
      }
    }),
    terser({
      format: {
        comments: false, // 移除所有注释
      },
    }),
  ]
};