export interface AppContext {
  theme: string; // 应用的主题
  language: string; // 应用的语言
  version: string; // 应用版本
  invoke: (command: string, args?: any) => Promise<any>; // 调用Tauri命令
}

// 传递给插件的属性
export interface PluginProps {
  appContext: AppContext; // 应用上下文
  pluginId: string; // 插件ID
}

// 插件元数据
export interface PluginInfo {
  name: string; // 插件名称
  version: string; // 插件版本
  description: string; // 插件描述
  author: string; // 插件作者
  icon: string; // 插件图标，使用RemixIcon
  category: string; // 插件分类
  tags: string[]; // 插件标签
  hasBackend: boolean; // 是否有后端.so库
  backendEntry: string; // 后端入口点名称
}

// 插件导出的内容
export interface PluginExport {
  default: React.FC<PluginProps>; // 默认导出的插件组件
  PluginInfo: PluginInfo; // 插件信息
}

// 加载好的插件对象
export interface LoadedPlugin {
  id: string; // 插件ID
  component: React.FC<PluginProps>; // 插件组件
  info: PluginInfo; // 插件信息
  enabled: boolean; // 是否启用
}
