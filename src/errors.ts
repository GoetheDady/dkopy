const errorMessages = {
  en: {
    maxDepthExceeded: (currentDepth: number, maxDepth: number) =>
      `Maximum depth of ${maxDepth} exceeded (current depth: ${currentDepth}). Please increase maxDepth option if needed.`
  },
  zh: {
    maxDepthExceeded: (currentDepth: number, maxDepth: number) =>
      `超出最大深度 ${maxDepth} (当前深度: ${currentDepth})。如有需要请增加 maxDepth 选项的值。`
  }
};

export class MaxDepthExceededError extends Error {
  constructor(currentDepth: number, maxDepth: number) {
    // 获取系统语言，默认使用英文
    const lang = typeof navigator !== 'undefined' 
      ? (navigator.language.startsWith('zh') ? 'zh' : 'en')
      : 'en';
    
    super(errorMessages[lang].maxDepthExceeded(currentDepth, maxDepth));
    this.name = 'MaxDepthExceededError';
  }
}
