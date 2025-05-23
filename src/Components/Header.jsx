import { Layout, Button, Flex } from "antd";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
const { Header } = Layout;

function HeaderComponent({ collapsed, handleClick }) {
  return (
    <Header
      style={{
        padding: "0 24px",
      }}
    >
      <Flex align="center" justify="space-between">
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={() => handleClick()}
          style={{
            fontSize: "16px",
            width: 64,
            height: 64,
          }}
        />
      </Flex>
    </Header>
  );
}

export default HeaderComponent;
