import { Menu } from "antd";
import { Header as AntdHeader } from "antd/es/layout/layout";
import "./styles.scss";

const Header = (): JSX.Element => {
  // Stores the details for the header buttons
  const items = [
    {
      key: 0,
      label: "Problems",
    },
    {
      key: 1,
      label: "Matching",
    },
  ];

  return (
    // Header Component
    <AntdHeader
      style={{
        display: "flex",
        alignItems: "center",
        background: "white",
      }}
    >
      <div style={{ display: "flex", flexDirection: "row" }}>
        <div className="logo1">Peer</div>
        <div className="logo2">Prep</div>
      </div>
      <Menu
        mode="horizontal"
        defaultSelectedKeys={["0"]}
        items={items}
        style={{ flex: 1, minWidth: 0 }}
      />
    </AntdHeader>
  );
};

export default Header;
