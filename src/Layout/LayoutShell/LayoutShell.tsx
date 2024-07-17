import { AppShell, Burger, Group, ScrollArea, Skeleton, UnstyledButton } from "@mantine/core"
import { RoutesComponent } from "../../Routes";
import { useDisclosure } from "@mantine/hooks";
import { Navbar } from "../Navbar/Navbar";
import { Footer } from "../Footer/Footer";
import Login from "../../Pages/Login";

export default function LayoutShell() {
  const [opened, { toggle }] = useDisclosure();

  return (
    <AppShell
      header={{ height: 60 }}
      padding="md"
    >
      <AppShell.Header>
          <Navbar/>
      </AppShell.Header>
      
      <AppShell.Main>
        <RoutesComponent/>
      </AppShell.Main>

      <AppShell.Footer>
        <Footer/>
      </AppShell.Footer>
    </AppShell>
  );
}