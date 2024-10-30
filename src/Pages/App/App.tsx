import React from 'react';
import './App.css';
import { Layout, Typography } from 'antd';
import Dashboard from '../Dashboard/Dashboard';

const { Content, Header } = Layout;
const { Title } = Typography;

const App: React.FC = () => {
  return (
    <>
        <Layout className='Layout'>
          <Header className='Header'>
            <div className="Logo"><img className='Logo' src="/reactDashboard-SureBright/logo.png" alt='logo' /></div>
            <Title level={3} className='Title'>React Dashboard</Title>
          </Header>
          <Content className='Content'>
            <Dashboard/>
          </Content>
        </Layout>
    </>
  )
};

export default App;
