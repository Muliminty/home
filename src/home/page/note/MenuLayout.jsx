import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // 导入 useNavigate
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { Menu } from "antd";
import styles from "./style.module.scss";

export const MenuLayout = ({
  dataSource = [], // 数据源，包含菜单项
  onClick,
  selectedKeys,
  changeOpenKeys,
  ...props
}) => {
  const [openKeys, setOpenKeys] = useState(props.openKeys || []);
  const [isFold, setIsFold] = useState(true); // 控制折叠状态
  const navigate = useNavigate(); // 获取 navigate 函数

  useEffect(() => {
    setOpenKeys(props.openKeys || []);
  }, [props.openKeys]);

  const handleGoHome = () => {
    navigate("/");
  };

  const handleToggleAll = () => {
    if (isFold) {
      // 全部展开：将所有一级菜单的 key 放入 openKeys
      const allKeys = dataSource.map((item) => item.key);
      console.log('allKeys: ', allKeys);
      setOpenKeys(allKeys);
      changeOpenKeys(allKeys); // 更新外部传入的 openKeys
    } else {
      // 全部折叠：清空 openKeys
      changeOpenKeys([]);
      // clearOpenKeys(); // 清空外部传入的 openKeys
    }
    setIsFold(!isFold); // 切换折叠状态
  };

  return (
    <div className={`${styles["menu"]}`}>
      <div className={styles["menu-title"]}>
        <div onClick={handleGoHome} className={styles["menu-title-home"]}>HOME</div>
        <div onClick={handleToggleAll}>
          <span>
            {isFold ? "全部展开" : "全部折叠"}
          </span>
          <span>
            {isFold ? (
              <MenuUnfoldOutlined onClick={handleToggleAll} />
            ) : (
              <MenuFoldOutlined onClick={handleToggleAll} />
            )}
          </span>
        </div>
      </div>

      <div className={styles["menu-content"]}>
        <Menu
          {...props}
          openKeys={openKeys}
          mode="inline"
          selectedKeys={selectedKeys}
          items={dataSource}
          onClick={onClick}
          onOpenChange={(keys) => setOpenKeys(keys)} // 响应用户手动展开/折叠操作
        />
      </div>
    </div>
  );
};
