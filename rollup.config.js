import typescript from 'rollup-plugin-typescript2';
import terser from '@rollup/plugin-terser';

export default {
  input: 'src/index.ts', // 入口文件
  output: [
    {
      file: 'dist/index.cjs', // CommonJS 格式输出
      format: 'cjs',
      exports: 'auto', // 自动检测导出方式
    },
    {
      file: 'dist/index.js', // ES 模块输出（package.json "type": "module" 下即为 ESM）
      format: 'es',
    },
  ],
  plugins: [
    typescript({
      useTsconfigDeclarationDir: true,
      tsconfigOverride: {
        compilerOptions: {
          module: 'esnext', // 使用 ES 模块
          declaration: true, // 生成类型声明文件
          declarationDir: 'dist', // 类型声明文件输出目录
          outDir: 'dist', // 输出目录
        },
      },
      tsconfig: './tsconfig.build.json', // 只含 src，保证声明文件平铺在 dist/ 下
    }),
    terser({
      format: {
        comments: false, // 移除所有注释
      },
    }),
  ],
};
