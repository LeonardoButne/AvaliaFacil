import '@mantine/core/styles.css';
import { Grid, MantineProvider } from '@mantine/core';
import { BrowserRouter as Router } from 'react-router-dom';
import { theme } from './theme';
import LayoutShell from './Layout/LayoutShell/LayoutShell';

export default function App() {
  return (
    
    <MantineProvider theme={theme}>
    
      <Router>
        <LayoutShell/>
      </Router>
    </MantineProvider>
  );
}