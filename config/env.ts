import { z } from 'zod';
import generatedConfig from './generated-config.json';
import type { GeneratedConfig } from './types';

// 验证生成的配置
const configSchema = z.object({
  baseUrl: z.string().url(),
  pageId: z.string(),
  siteMeta: z.object({
    title: z.string(),
    description: z.string(),
    icon: z.string(),
  }),
  isPlaceholder: z.boolean(),
  isEditThisPage: z.boolean(),
  isShowStarButton: z.boolean(),
  isShowHomeButton: z.boolean(),
});

// 确保配置符合schema
const config = configSchema.parse(generatedConfig);

// 仅包含运行时环境变量
const runtimeEnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

// 完整环境配置
export const env = {
  // 从配置文件获取的数据
  config: {
    ...config,
  },

  // 运行时环境变量
  runtime: {
    NODE_ENV: process.env.NODE_ENV || 'development',
  },
};

// 导出类型
export type Env = typeof env;
