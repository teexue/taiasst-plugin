import { useState, useEffect } from "react";
import { Card, Space, Typography, Button, Input } from "antd";
import { invoke } from "@tauri-apps/api/core";

// 插件组件
function Plugin() {
  const [count, setCount] = useState(0);
  const [inputValue, setInputValue] = useState("");

  const userInfo = async () => {
    const userInfo = await invoke("get_user_info");
    console.log(userInfo);
  };

  const handleIncrement = () => {
    setCount(count + 1);
  };

  const handleReset = () => {
    setCount(0);
    setInputValue("");
  };

  const { Title, Text, Paragraph } = Typography;

  useEffect(() => {
    userInfo();
  }, []);

  return (
    <Card title="TaiAsst演示插件" style={{ width: "100%" }}>
      <Space direction="vertical" style={{ width: "100%" }}>
        <Title level={4}>插件演示</Title>

        <Paragraph>
          这是一个TaiAsst插件示例。 它展示了如何创建一个简单的React +
          Antd组件，并包含了基本的交互功能。
          注意：此插件在实际环境中使用全局提供的依赖，不需要外部导入。
        </Paragraph>

        <Card>
          <Space direction="vertical">
            <Text strong>当前计数: {count}</Text>
            <Button type="primary" onClick={handleIncrement}>
              增加计数
            </Button>

            <div style={{ marginTop: 16 }}>
              <Input
                placeholder="输入一些文本"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                style={{ marginBottom: 8 }}
              />
              {inputValue && <Text>你输入了: {inputValue}</Text>}
            </div>
          </Space>
        </Card>

        <Button onClick={handleReset}>重置</Button>
      </Space>
    </Card>
  );
}

// 直接导出Plugin组件
export default Plugin;
