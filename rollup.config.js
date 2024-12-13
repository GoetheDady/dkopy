import typescript from 'rollup-plugin-typescript2'
import terser from '@rollup/plugin-terser';
import del from 'rollup-plugin-delete';

export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/index.cjs',
      format: 'cjs'
    },
    {
      file: 'dist/index.js',
      format: 'es'
    }
  ],
  plugins: [
    typescript({
      useTsconfigDeclarationDir: true,
      tsconfigOverride: {
        compilerOptions: {
          module: "esnext",
          declaration: true, // 确保生成类型声明
          declarationDir: 'dist', // 类型声明输出目录
          outDir: 'dist', // 输出目录
        }
      },
      tsconfig: './tsconfig.json',
    }),
    terser({
      format: {
        comments: false, // 移除所有注释
      },
    }),
    del({ targets: 'dist/*' }), // 在构建前删除 dist 目录
  ]
};