import { Layout, Typography, Divider } from "antd";
import Plugin from "./index";

const { Header, Content, Footer } = Layout;
const { Title, Text } = Typography;

function App() {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header style={{ background: "#fff", padding: "0 24px" }}>
        <Title level={3} style={{ margin: "16px 0" }}>
          TaiAsst插件预览
        </Title>
      </Header>
      <Content style={{ padding: "24px", background: "#f0f2f5" }}>
        <div
          style={{ background: "#fff", padding: "24px", borderRadius: "4px" }}
        >
          <Title level={4}>插件开发预览环境</Title>
          <Text>
            以下是插件在实际环境中的显示效果（主题请在实际项目中查看）：
          </Text>
          <Divider />

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
      <Footer style={{ textAlign: "center" }}>
        TaiAsst插件开发框架 ©{new Date().getFullYear()}
      </Footer>
    </Layout>
  );
}

export default App;
