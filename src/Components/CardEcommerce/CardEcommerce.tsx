// EcommerceCard.tsx
import React from 'react';
import { Card, Text, Badge, Button, Group, Avatar, Center } from '@mantine/core';
import { useNavigate } from 'react-router-dom';


interface EcommerceProps {
  ecommerce: {
    id: string;
    ecommerce_name: string;
    category: string;
    website: string;
    provinceSelect: string;
    citySelect: string;
    phone: string;
    contact_email: string;
    legal_representative: string;
    foundation_date: string;
    suspended: boolean; // Ajuste para incluir a propriedade 'suspended'
    profileImage: string;
  };
}

const CardEcommerce: React.FC<EcommerceProps> = ({ ecommerce }) => {
  const navigate = useNavigate();

  const handleViewProfile = () => {
    navigate(`/perfil/${ecommerce.ecommerce_name}`);
  };

  return (
    <Card shadow="sm" padding="sm" radius="md" withBorder style={{ marginTop: '50px', width: '300px', height: '350px' }}>
      <Card.Section>
        <Center>
          <Avatar
          
            src={ecommerce.profileImage}
            alt={ecommerce.ecommerce_name}
            size="150"
             
            radius="100%"
            style={{ border: '2px solid #f5b50a'}}
          />
        </Center>
      </Card.Section>

      <Group justify="space-between" mt="md" mb="xs">
        <Text fw={500}>{ecommerce.ecommerce_name}</Text>
        {ecommerce.suspended ? (
          <Badge color="red">Suspenso</Badge> // Exibe "Suspenso" se a propriedade for true
        ) : (
          <Badge color="green">Activo</Badge> // Exibe "Ativo" se a propriedade for false
        )}
      </Group>

      <Text size="sm" c="dimmed">
        <strong>Category:</strong> {ecommerce.category}
        <br />
        <strong>Province:</strong> {ecommerce.provinceSelect}
        <br />
        <strong>City:</strong> {ecommerce.citySelect}
      </Text>

      <Button color="blue" fullWidth mt="md" radius="md" onClick={handleViewProfile}>
        View Profile
      </Button>
    </Card>
  );
};

export default CardEcommerce;
