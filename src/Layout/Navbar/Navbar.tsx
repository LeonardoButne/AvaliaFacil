import { Autocomplete, Group, Burger, rem } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconSearch } from '@tabler/icons-react';
import classes from '../../Styles/Header.module.css';
import { Link } from 'react-router-dom';

export const Navbar = () => {
  const [opened, { toggle }] = useDisclosure(false);

  return (
    <header className={classes.header}>
      <div className={classes.inner}>
        <Group>
          <Burger opened={opened} onClick={toggle} size="sm" hiddenFrom="sm" />
            Logo
        </Group>

        <Group>
          <Group ml={50} gap={5} className={classes.links} visibleFrom="sm">
            <Link to="/" className={classes.link}>
              Home
            </Link>
            <Link to="/contacto" className={classes.link}>
              Contacto
            </Link>
            <Link to="/sobre" className={classes.link}>
              Sobre
            </Link>
            <Link to="/login" className={classes.link}>
              Login
            </Link>
          </Group>
          <Autocomplete
            className={classes.search}
            radius={50}
            size='md'
            placeholder="Search"
            leftSection={<IconSearch style={{ width: rem(16), height: rem(16) }} stroke={1.5} />}
            data={['React', 'Angular', 'Vue', 'Next.js', 'Riot.js', 'Svelte', 'Blitz.js']}
            visibleFrom="xs"
          />
        </Group>
      </div>
    </header>
  );
}

export default Navbar
