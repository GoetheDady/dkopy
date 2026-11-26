import terser from '@rollup/plugin-terser';

export default {
  input: 'build/index.js',
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
    terser({
      format: {
        comments: false, // 移除所有注释
      },
    }),
  ],
};
