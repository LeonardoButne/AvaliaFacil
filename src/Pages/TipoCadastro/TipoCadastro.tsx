import { Card, Group, Badge, Button, Text, Center, Image, Grid } from '@mantine/core';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { IconGasStation, IconGauge, IconManualGearbox, IconUsers } from '@tabler/icons-react';
import classes from './TipoCadastro.module.css';

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
  price: string;
  buttonLink: string;
}

const CardComponent: React.FC<CardComponentProps> = ({ data, image, title, price, buttonLink }) => {
  const navigate = useNavigate();

  const features = data.map((feature) => (
    <Center key={feature.label}>
      <feature.icon size="1.05rem" className={classes.icon} stroke={1.5} />
      <Text size="xs">{feature.label}</Text>
    </Center>
  ));

  return (
    <Card withBorder radius="md" className={classes.card}>
      <Card.Section className={classes.imageSection}>
        <Image src={image} alt={title} />
      </Card.Section>

      <Group justify="space-between" mt="md">
        <div>
          <Text fw={500}>{title}</Text>
          <Text fz="xs" c="dimmed">
            Free recharge at any station
          </Text>
        </div>
        <Badge variant="outline">25% off</Badge>
      </Group>

      <Card.Section className={classes.section} mt="md">
        <Text fz="sm" c="dimmed" className={classes.label}>
          Basic configuration
        </Text>

        <Group gap={8} mb={-8}>
          {features}
        </Group>
      </Card.Section>

      <Card.Section className={classes.section}>
        <Group gap={30}>
          <div>
            <Text fz="xl" fw={700} style={{ lineHeight: 1 }}>
              {price}
            </Text>
            <Text fz="sm" c="dimmed" fw={500} style={{ lineHeight: 1 }} mt={3}>
              per day
            </Text>
          </div>

          <Button radius="xl" style={{ flex: 1 }} onClick={() => navigate(buttonLink)}>
            Rent now
          </Button>
        </Group>
      </Card.Section>
    </Card>
  );
};

const TipoCadastro: React.FC = () => {
  return (
    <Grid>
      <Grid.Col span={6}>
        <CardComponent 
          data={mockdata1} 
          image="https://i.imgur.com/ZL52Q2D.png" 
          title="Tesla Model S" 
          price="$168.00" 
          buttonLink="/cadastro_consumidor"
        />
      </Grid.Col>
      <Grid.Col span={6}>
        <CardComponent 
          data={mockdata2} 
          image="https://i.imgur.com/someotherimage.png" 
          title="Tesla Model X" 
          price="$200.00" 
          buttonLink="/cadastro_ecommerce"
        />
      </Grid.Col>
    </Grid>
  );
};

export default TipoCadastro;
