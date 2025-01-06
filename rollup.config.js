import typescript from 'rollup-plugin-typescript2';
import terser from '@rollup/plugin-terser';
import del from 'rollup-plugin-delete';
import { nodeResolve } from '@rollup/plugin-node-resolve'; // 解析 node_modules 中的模块
import commonjs from '@rollup/plugin-commonjs'; // 将 CommonJS 模块转换为 ES6
import json from '@rollup/plugin-json'; // 支持导入 JSON 文件

export default {
  input: 'src/index.ts', // 入口文件
  output: [
    {
      file: 'dist/index.cjs', // CommonJS 格式输出
      format: 'cjs',
      exports: 'auto', // 自动检测导出方式
    },
    {
      file: 'dist/index.mjs', // ES 模块格式输出
      format: 'es',
    },
  ],
  plugins: [
    del({ targets: 'dist/*' }), // 在构建前清理 dist 目录
    nodeResolve(), // 解析 node_modules 中的模块
    commonjs(), // 将 CommonJS 模块转换为 ES6
    json(), // 支持导入 JSON 文件
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
      tsconfig: './tsconfig.json', // 指定 tsconfig 文件
    }),
    terser({
      format: {
        comments: false, // 移除所有注释
      },
    }),
  ],
};
