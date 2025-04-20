import { useState, useEffect } from "react";
import {
  Layout,
  Typography,
  Divider,
  Form,
  Input,
  Button,
  Switch,
  Select,
  message,
  InputNumber,
  Space,
  Checkbox,
} from "antd";
import Plugin from "./index";

const { Header, Content, Footer, Sider } = Layout;
const { Title, Text } = Typography;
const { TextArea } = Input;

// 插件类型枚举
enum PluginType {
  /** 工具插件 */
  Tool = "tool",
  /** 系统插件 */
  System = "system",
  /** AI插件 */
  Ai = "ai",
}

// 初始化插件信息
const defaultPluginInfo = {
  id: "taiasst-plugin-example",
  name: "示例插件",
  version: "1.0.0",
  plugin_type: PluginType.Tool,
  description: "这是一个示例插件，展示插件系统的基本功能",
  author: "taiasst开发组",
  has_backend: true,
  backend_lib: "plugin.dll",
  dependencies: [],
  menu_options: {
    show_in_menu: true,
    menu_title: "示例插件",
    menu_order: 1,
    menu_group: "工具",
  },
  config_options: [],
};

function App() {
  const [form] = Form.useForm();
  const [pluginInfo, setPluginInfo] = useState(defaultPluginInfo);
  const [dependencies, setDependencies] = useState<
    { id: string; version: string }[]
  >([]);
  const [configOptions, setConfigOptions] = useState<
    {
      name: string;
      description: string;
      default_value: string;
      options: string;
      required: boolean;
    }[]
  >([]);
  const [hasBackend, setHasBackend] = useState(defaultPluginInfo.has_backend);
  const [showInMenu, setShowInMenu] = useState(
    defaultPluginInfo.menu_options.show_in_menu
  );

  useEffect(() => {
    // 初始化表单
    form.setFieldsValue({
      ...pluginInfo,
      menu_title: pluginInfo.menu_options.menu_title,
      show_in_menu: pluginInfo.menu_options.show_in_menu,
      menu_order: pluginInfo.menu_options.menu_order,
      menu_group: pluginInfo.menu_options.menu_group,
    });

    // 确保状态变量与初始值一致
    setHasBackend(pluginInfo.has_backend);
    setShowInMenu(pluginInfo.menu_options.show_in_menu);
  }, [form, pluginInfo]);

  const handleFormValuesChange = (changedValues: { [x: string]: any }) => {
    // 更新插件信息状态
    const newPluginInfo = { ...pluginInfo };
    Object.keys(changedValues).forEach((key) => {
      if (key === "show_in_menu") {
        newPluginInfo.menu_options.show_in_menu = changedValues[key];
        setShowInMenu(changedValues[key]);
      } else if (key === "menu_title") {
        newPluginInfo.menu_options.menu_title = changedValues[key];
      } else if (key === "menu_order") {
        newPluginInfo.menu_options.menu_order = changedValues[key];
      } else if (key === "menu_group") {
        newPluginInfo.menu_options.menu_group = changedValues[key];
      } else if (key === "has_backend") {
        newPluginInfo.has_backend = changedValues[key];
        setHasBackend(changedValues[key]);
      } else {
        (newPluginInfo as Record<string, any>)[key] = changedValues[key];
      }
    });
    setPluginInfo(newPluginInfo);
  };

  const handleAddDependency = () => {
    setDependencies([...dependencies, { id: "", version: "" }]);
  };

  const handleRemoveDependency = (index: number) => {
    const newDependencies = [...dependencies];
    newDependencies.splice(index, 1);
    setDependencies(newDependencies);
  };

  const handleDependencyChange = (
    index: number,
    field: string,
    value: string
  ) => {
    const newDependencies = [...dependencies];
    (newDependencies[index] as any)[field] = value;
    setDependencies(newDependencies);
  };

  const handleAddConfigOption = () => {
    setConfigOptions([
      ...configOptions,
      {
        name: "",
        description: "",
        default_value: "",
        options: "",
        required: false,
      },
    ]);
  };

  const handleRemoveConfigOption = (index: number) => {
    const newConfigOptions = [...configOptions];
    newConfigOptions.splice(index, 1);
    setConfigOptions(newConfigOptions);
  };

  const handleConfigOptionChange = (
    index: number,
    field: string,
    value: any
  ) => {
    const newConfigOptions = [...configOptions];
    (newConfigOptions[index] as any)[field] = value;
    setConfigOptions(newConfigOptions);
  };

  const generateJsonFile = () => {
    const values = form.getFieldsValue();

    // 处理菜单选项
    const menuOptions = {
      show_in_menu: values.show_in_menu,
      menu_title: values.menu_title || values.name,
      menu_order: values.menu_order || 1,
      menu_group: values.menu_group || "工具",
    };

    // 处理依赖和配置选项
    const processedDependencies = dependencies.filter(
      (dep) => dep.id && dep.version
    );
    const processedConfigOptions = configOptions
      .map((config) => ({
        ...config,
        options: config.options
          ? config.options.split(",").map((opt) => opt.trim())
          : undefined,
      }))
      .filter((config) => config.name);

    const jsonContent = {
      id: values.id,
      name: values.name,
      version: values.version,
      plugin_type: values.plugin_type,
      description: values.description,
      author: values.author,
      has_backend: values.has_backend,
      backend_lib: values.has_backend ? values.backend_lib : undefined,
      dependencies:
        processedDependencies.length > 0 ? processedDependencies : [],
      menu_options: menuOptions,
      config_options:
        processedConfigOptions.length > 0 ? processedConfigOptions : [],
    };

    // 删除表单专用字段
    const {
      show_in_menu,
      menu_title,
      menu_order,
      menu_group,
      ...jsonWithoutFormFields
    } = jsonContent as any;

    const blob = new Blob([JSON.stringify(jsonWithoutFormFields, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "metadata.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    message.success("metadata.json已生成，请替换项目根目录中的同名文件");
  };

  return (
    <Layout style={{ height: "98vh" }}>
      <Header style={{ background: "#fff", padding: "0 24px" }}>
        <Title level={3} style={{ margin: "16px 0" }}>
          <Space>
            TaiAsst插件预览
            <Text>
              以下是插件在实际环境中的显示效果（主题请在实际项目中查看）
            </Text>
          </Space>
        </Title>
      </Header>
      <Layout>
        <Content
          style={{ padding: "24px", background: "#f0f2f5", overflow: "auto" }}
        >
          <div
            style={{ background: "#fff", padding: "24px", borderRadius: "4px" }}
          >
            <div
              style={{
                padding: "16px",
                border: "1px dashed #d9d9d9",
                borderRadius: "4px",
              }}
            >
              <Plugin />
            </div>
          </div>
        </Content>
        <Sider
          width={400}
          style={{ background: "#fff", padding: "24px", overflow: "auto" }}
        >
          <Title level={4}>插件配置</Title>
          <Text>修改并生成plugin.json文件</Text>
          <Divider />

          <Form
            form={form}
            layout="vertical"
            onValuesChange={handleFormValuesChange}
            initialValues={{
              ...defaultPluginInfo,
              menu_title: defaultPluginInfo.menu_options.menu_title,
              show_in_menu: defaultPluginInfo.menu_options.show_in_menu,
              menu_order: defaultPluginInfo.menu_options.menu_order,
              menu_group: defaultPluginInfo.menu_options.menu_group,
            }}
          >
            <Form.Item
              name="id"
              label="插件ID"
              rules={[{ required: true, message: "请输入插件ID" }]}
            >
              <Input placeholder="唯一标识，如taiasst-plugin-example" />
            </Form.Item>

            <Form.Item
              name="name"
              label="插件名称"
              rules={[{ required: true, message: "请输入插件名称" }]}
            >
              <Input placeholder="显示名称，如示例插件" />
            </Form.Item>

            <Form.Item
              name="version"
              label="版本号"
              rules={[{ required: true, message: "请输入版本号" }]}
            >
              <Input placeholder="如1.0.0" />
            </Form.Item>

            <Form.Item
              name="plugin_type"
              label="插件类型"
              rules={[{ required: true, message: "请选择插件类型" }]}
            >
              <Select placeholder="选择插件类型">
                <Select.Option value={PluginType.Tool}>工具插件</Select.Option>
                <Select.Option value={PluginType.System}>
                  系统插件
                </Select.Option>
                <Select.Option value={PluginType.Ai}>AI插件</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item name="description" label="描述">
              <TextArea rows={3} placeholder="插件功能描述" />
            </Form.Item>

            <Form.Item name="author" label="作者">
              <Input placeholder="开发者或组织名称" />
            </Form.Item>

            <Form.Item
              name="has_backend"
              label="包含后端"
              valuePropName="checked"
            >
              <Switch defaultChecked={defaultPluginInfo.has_backend} />
            </Form.Item>

            {hasBackend && (
              <Form.Item name="backend_lib" label="后端库文件">
                <Input placeholder="如plugin.dll" />
              </Form.Item>
            )}

            <Divider>菜单选项</Divider>

            <Form.Item
              name="show_in_menu"
              label="在菜单中显示"
              valuePropName="checked"
            >
              <Switch
                defaultChecked={defaultPluginInfo.menu_options.show_in_menu}
              />
            </Form.Item>

            {showInMenu && (
              <>
                <Form.Item name="menu_title" label="菜单显示名称">
                  <Input placeholder="菜单项标题" />
                </Form.Item>

                <Form.Item name="menu_order" label="菜单排序">
                  <InputNumber min={1} placeholder="数字越小越靠前" />
                </Form.Item>

                <Form.Item name="menu_group" label="菜单分组">
                  <Input placeholder="菜单分组名称" />
                </Form.Item>
              </>
            )}

            <Divider>依赖配置</Divider>

            {dependencies.map((dep, index) => (
              <div key={`dep-${index}`} style={{ marginBottom: "8px" }}>
                <Space align="baseline">
                  <Form.Item label="依赖ID">
                    <Input
                      value={dep.id}
                      onChange={(e) =>
                        handleDependencyChange(index, "id", e.target.value)
                      }
                      placeholder="依赖插件ID"
                    />
                  </Form.Item>
                  <Form.Item label="版本">
                    <Input
                      value={dep.version}
                      onChange={(e) =>
                        handleDependencyChange(index, "version", e.target.value)
                      }
                      placeholder="版本号"
                    />
                  </Form.Item>
                  <Button danger onClick={() => handleRemoveDependency(index)}>
                    删除
                  </Button>
                </Space>
              </div>
            ))}

            <Button
              type="dashed"
              onClick={handleAddDependency}
              style={{ marginBottom: "16px" }}
              block
            >
              添加依赖
            </Button>

            <Divider>配置选项</Divider>

            {configOptions.map((config, index) => (
              <div
                key={`config-${index}`}
                style={{
                  border: "1px dashed #d9d9d9",
                  padding: "8px",
                  marginBottom: "16px",
                }}
              >
                <Space direction="vertical" style={{ width: "100%" }}>
                  <Form.Item label="配置名称">
                    <Input
                      value={config.name}
                      onChange={(e) =>
                        handleConfigOptionChange(index, "name", e.target.value)
                      }
                      placeholder="配置名称"
                    />
                  </Form.Item>
                  <Form.Item label="配置描述">
                    <Input
                      value={config.description}
                      onChange={(e) =>
                        handleConfigOptionChange(
                          index,
                          "description",
                          e.target.value
                        )
                      }
                      placeholder="配置描述"
                    />
                  </Form.Item>
                  <Form.Item label="默认值">
                    <Input
                      value={config.default_value}
                      onChange={(e) =>
                        handleConfigOptionChange(
                          index,
                          "default_value",
                          e.target.value
                        )
                      }
                      placeholder="默认值"
                    />
                  </Form.Item>
                  <Form.Item label="可选项 (逗号分隔)">
                    <Input
                      value={config.options}
                      onChange={(e) =>
                        handleConfigOptionChange(
                          index,
                          "options",
                          e.target.value
                        )
                      }
                      placeholder="选项1, 选项2, 选项3"
                    />
                  </Form.Item>
                  <Form.Item label="是否必填">
                    <Checkbox
                      checked={config.required}
                      onChange={(e) =>
                        handleConfigOptionChange(
                          index,
                          "required",
                          e.target.checked
                        )
                      }
                    >
                      必填
                    </Checkbox>
                  </Form.Item>
                  <Button
                    danger
                    onClick={() => handleRemoveConfigOption(index)}
                  >
                    删除配置项
                  </Button>
                </Space>
              </div>
            ))}

            <Button
              type="dashed"
              onClick={handleAddConfigOption}
              style={{ marginBottom: "16px" }}
              block
            >
              添加配置选项
            </Button>

            <Divider />

            <Form.Item>
              <Button type="primary" onClick={generateJsonFile} block>
                生成plugin.json
              </Button>
            </Form.Item>
          </Form>
        </Sider>
      </Layout>
      <Footer style={{ textAlign: "center" }}>
        TaiAsst插件开发框架 ©{new Date().getFullYear()}
      </Footer>
    </Layout>
  );
}

export default App;
