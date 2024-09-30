import { AppShell, Group, rem, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import Navbar from '../Navbar/Navbar';
import Home from '../../Pages/Home';
import Footer from '../Footer/Footer';

export function LayoutShell() {
  const [opened, { toggle }] = useDisclosure();

  return (
    <AppShell
  padding={0}
  header={{ height: 57 }}
  
>
      <AppShell.Header>
        <Navbar/>
      </AppShell.Header>

      <AppShell.Main>
        <Home />
      </AppShell.Main>
        
        <Footer/>
      
    
    </AppShell>
  );
}

export default LayoutShell