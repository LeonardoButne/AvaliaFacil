import React from 'react';
import { getDatabase, ref, onValue, DataSnapshot } from 'firebase/database';
import { Grid, Container, Skeleton } from '@mantine/core';
import Spinner from '../../Components/Spinner/Spinner.tsx';
import CardEcommerce from '../../Components/CardEcommerce/CardEcommerce.tsx';
import { getApps, initializeApp } from 'firebase/app';
import { firebaseConfig } from '../../Config/FirebaseConfig.ts';
import HeroImageBackground from '../../Layout/HeroHeader/HeroimageBackground.tsx';
import { FaqWithImage } from '../../Layout/FaqWithImage/FaqWithImage.tsx';

interface Ecommerce {
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
  status: boolean;
  profileImage: string;
  suspended: boolean;
}

const EcommerceData: React.FC = () => {

  if (!getApps().length) {
    initializeApp(firebaseConfig);
  }

  const db = getDatabase();
  const [ecommerces, setEcommerces] = React.useState<Ecommerce[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const ecommerceRef = ref(db, "feedbackAqui/ecommerces");

    const unsubscribe = onValue(ecommerceRef, (snapshot: DataSnapshot) => {
      const data = snapshot.val();
      console.log('Data from Firebase:', data);

      if (data) {
        const dataArray: Ecommerce[] = Object.keys(data).map((key) => ({
          ...data[key],
          id: key,
        }));
        setEcommerces(dataArray);
      } else {
        setEcommerces([]);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, [db]);

  console.log('Ecommerces state:', ecommerces);

  return (
    <Container 
      fluid // Faz o container ocupar 100% da largura
      style={{ padding: 0 }} // Remove o padding do container
    >
      <HeroImageBackground />

      <Grid 
        gutter={0} // Remove o espaço entre colunas
        justify="center" // Centraliza o conteúdo dentro da Grid
      >
        {loading ? (
          <Grid.Col span={12}>
            <Skeleton height={200} />
            <Skeleton height={200} mt="sm" />
            <Skeleton height={200} mt="sm" />
          </Grid.Col>
        ) : ecommerces.length > 0 ? (
          ecommerces.map((ecommerce) => (
            <Grid.Col key={ecommerce.id} span={3}>
              <CardEcommerce ecommerce={ecommerce} />
            </Grid.Col>
          ))
        ) : (
          <Grid.Col span={8}>
            <Spinner />
          </Grid.Col>
        )}
      </Grid>

      <FaqWithImage />
    </Container>
  );
};

export default EcommerceData;
