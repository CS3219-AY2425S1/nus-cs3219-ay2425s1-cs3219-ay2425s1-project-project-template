import { AppShell } from '@mantine/core';
import { useMantineTheme } from '@mantine/core';
import { lazy } from 'react';

import './Dashboard.css';


const Header = lazy(() => import('../components/Header'));

function Dashboard() {
  const theme = useMantineTheme();
  return (
    <AppShell withBorder={false} header={{ height: 80 }}>
      <Header />
      <AppShell.Main h="calc(100vh - 80px)" w="100%" bg="slate.9">
        <div className='dashboard-container'>
          <div className='dashboard-header'>
            <div className='dashboard-stats'>

            </div>
            <div className='dashboard-practice'>

            </div>
          </div>
          <table className='dashboard-table'>
            <thead>
              <tr>
                <th>Username</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>admin</td>
                <td>admin</td>
                <td>edit</td>
              </tr>
              <tr>
                <td>user</td>
                <td>user</td>
                <td>edit</td>
              </tr>
            </tbody>
          </table>
        </div>
      </AppShell.Main>
    </AppShell>
  );
}

export default Dashboard;