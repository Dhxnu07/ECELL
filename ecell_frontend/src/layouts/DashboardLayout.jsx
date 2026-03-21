import React, { useState } from 'react';
import { Layout, Menu, Button, Avatar, Typography, Space } from 'antd';
import { 
  MenuFoldOutlined, 
  MenuUnfoldOutlined, 
  UserOutlined, 
  CalendarOutlined,
  RocketOutlined,
  ReadOutlined
} from '@ant-design/icons';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;

const DashboardLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      key: '/events',
      icon: <CalendarOutlined />,
      label: 'Events',
    },
    {
      key: '/pitches',
      icon: <RocketOutlined />,
      label: 'Startup Pitches',
    },
    {
      key: '/blog',
      icon: <ReadOutlined />,
      label: 'Blog',
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider 
        trigger={null} 
        collapsible 
        collapsed={collapsed}
        theme="light"
        style={{
          boxShadow: '2px 0 8px 0 rgba(29,35,41,.05)',
          zIndex: 10,
        }}
        width={250}
      >
        <div style={{ padding: '24px 16px', textAlign: 'center' }}>
          <Space align="center" direction={collapsed ? "vertical" : "horizontal"}>
            <div style={{ 
              width: 32, height: 32, 
              background: 'linear-gradient(135deg, #1890ff 0%, #0050b3 100%)', 
              borderRadius: 8,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', fontWeight: 'bold' 
            }}>E</div>
            {!collapsed && <Title level={4} style={{ margin: 0, letterSpacing: '-0.5px' }}>ECell Portal</Title>}
          </Space>
        </div>
        <Menu
          theme="light"
          mode="inline"
          selectedKeys={[location.pathname]}
          onClick={({ key }) => navigate(key)}
          items={menuItems}
          style={{ borderRight: 0, padding: '0 12px' }}
        />
      </Sider>
      <Layout>
        <Header 
          style={{ 
            padding: '0 24px', 
            background: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 1px 4px rgba(0,21,41,.08)',
            zIndex: 9
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ fontSize: '16px', width: 64, height: 64 }}
          />
          <Space size="middle">
            <Text type="secondary">Welcome, Student</Text>
            <Avatar style={{ backgroundColor: '#1890ff' }} icon={<UserOutlined />} />
          </Space>
        </Header>
        <Content
          style={{
            margin: '24px',
            padding: 24,
            minHeight: 280,
            overflow: 'auto'
          }}
        >
          {/* Main content area */}
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default DashboardLayout;
