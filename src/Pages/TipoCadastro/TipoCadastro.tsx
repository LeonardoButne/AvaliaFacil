import { Card, Group, Button, Text, Center, Image, Grid } from '@mantine/core';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { IconGasStation, IconGauge, IconManualGearbox, IconUsers } from '@tabler/icons-react';
import classes from './TipoCadastro.module.css';
import imagemConsumidor from '../../assets/group.png';
import imagemEcommerce from '../../assets/online-shop.png';

const mockdata1 = [
  { label: '4 passengers', icon: IconUsers },
  { label: '100 km/h in 4 seconds', icon: IconGauge },
  { label: 'Automatic gearbox', icon: IconManualGearbox },
  { label: 'Electric', icon: IconGasStation },
];

const mockdata2 = [
  { label: '5 passengers', icon: IconUsers },
  { label: '120 km/h in 3.5 seconds', icon: IconGauge },
  { label: 'Manual gearbox', icon: IconManualGearbox },
  { label: 'Hybrid', icon: IconGasStation },
];

interface CardComponentProps {
  data: typeof mockdata1;
  image: string;
  title: string;
  buttonLink: string;
}

const CardComponent: React.FC<CardComponentProps> = ({ data, image, title, buttonLink }) => {
  const navigate = useNavigate();

  const features = data.map((feature) => (
    <Center key={feature.label}>
      <feature.icon size="1.05rem" className={classes.icon} stroke={1.5} />
      <Text size="xs">{feature.label}</Text>
    </Center>
  ));

  return (
    <Card withBorder radius="md" className={classes.card} style={{width: '100%' }}>
      <Card.Section className={classes.imageSection}>
        <Image src={image} alt={title} />
      </Card.Section>

      <Group align="apart" mt="md">
        <div>
          <Text fw={500}>{title}</Text>
          <Text fz="xs" c="dimmed">
            Free recharge at any station
          </Text>
        </div>
      </Group>

      <Card.Section className={classes.section}>
        <Group gap={30}>
          <Button radius="xl" style={{ flex: 1 }} onClick={() => navigate(buttonLink)}>
            Cadastrar-se
          </Button>
        </Group>
      </Card.Section>
    </Card>
  );
};

const TipoCadastro: React.FC = () => {
  return (
    <Center style={{ height: '100vh' }}>
      <Grid justify="center" align="center" style={{width: '100%', maxWidth: '100%' }}>
        <Grid.Col span={2}>
          <CardComponent 
            data={mockdata1} 
            image={imagemConsumidor} 
            title="Cadastrar-se como Consumidor" 
            buttonLink="/cadastro_consumidor"
          />
        </Grid.Col>
        <Grid.Col span={2}>
          <CardComponent 
            data={mockdata2} 
            image={imagemEcommerce} 
            title="Cadastrar-se como Ecommerce" 
            buttonLink="/cadastro_ecommerce"
          />
        </Grid.Col>
      </Grid>
      </Center>
  );
};

export default TipoCadastro;
