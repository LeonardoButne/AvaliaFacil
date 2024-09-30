import cx from 'clsx';
import { Title, Text, Container, Button, Overlay } from '@mantine/core';
import classes from './HeroImageBackground.module.css';

export function HeroImageBackground() {
  return (
    <div className={classes.wrapper}>
      <Overlay color="#000" opacity={0.65} zIndex={1} />

      <div className={classes.inner}>
        <Title className={classes.title}>
          Faça avaliações de e-commerces {' '}
          <Text component="span" inherit className={classes.highlight}>
          num só lugar
          </Text>
        </Title>

        <Container size={640}>
          <Text size="lg" className={classes.description}>
            Crie uma conta para poder fazer avaliações e usufruir de mais opções
          </Text>
        </Container>

        <div className={classes.controls}>
          <Button className={classes.control} variant="white" size="lg">
            Criar uma conta
          </Button>
          <Button className={cx(classes.control, classes.secondaryControl)} size="lg">
            Live demo
          </Button>
        </div>
      </div>
    </div>
  );
}

export default HeroImageBackground