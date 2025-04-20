import { invoke } from "@tauri-apps/api/core";

// 判断是否为开发环境
const isDev = process.env.NODE_ENV === "development";

/**
 * 调用Tauri后端函数
 * @param cmd 命令名称（对应Tauri后端函数名）
 * @param args 传递给函数的参数
 * @returns 函数执行结果的Promise
 */
export async function invokeCommand<T>(
  cmd: string,
  args?: Record<string, any>
): Promise<T> {
  // 生产环境直接调用Tauri API
  if (!isDev) {
    return invoke<T>(cmd, args);
  }

  // 开发环境使用mock
  return mockInvoke<T>(cmd, args);
}

// 这个函数在生产环境中会被tree-shaking移除
function mockInvoke<T>(cmd: string, args?: Record<string, any>): Promise<T> {
  console.log(`[MOCK] 调用了${cmd}函数`, args);

  // mock函数映射
  const mockImplementations: Record<
    string,
    (args?: Record<string, any>) => any
  > = {
    hello_world: (args) => {
      return `Hello, ${args?.name || "World"}! 这是mock响应`;
    },
    get_data: () => {
      return { success: true, data: [1, 2, 3, 4, 5] };
    },
    // 可以根据需要添加更多mock函数
  };

  // 查找并执行mock实现
  const mockFn = mockImplementations[cmd];
  if (mockFn) {
    return Promise.resolve(mockFn(args) as T);
  }

  // 没有对应mock函数时提供警告
  console.warn(`[MOCK WARNING] 未找到命令"${cmd}"的mock实现，返回空对象`);
  return Promise.resolve({} as T);
}

// 用法示例:
// import { invokeCommand } from './util';
//
// // 调用后端函数
// const result = await invokeCommand('hello_world', { name: '张三' });
// console.log(result);
