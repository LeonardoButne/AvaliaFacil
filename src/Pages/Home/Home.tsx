// EcommerceData.tsx
import React from 'react';
import { getDatabase, ref, onValue, DataSnapshot } from 'firebase/database';
import { Grid, Container } from '@mantine/core';
import Spinner from '../../Components/Spinner/Spinner.tsx';
import CardEcommerce from '../../Components/CardEcommerce/CardEcommerce.tsx';
import { getApps, initializeApp } from 'firebase/app';
import { firebaseConfig } from '../../Config/FirebaseConfig.ts';



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
}

const EcommerceData: React.FC = () => {

  // Initialize Firebase app
  if (!getApps().length) {
    initializeApp(firebaseConfig);
  }

  
  // Get a reference to the database
  const db = getDatabase();

  const [ecommerces, setEcommerces] = React.useState<Ecommerce[]>([]);

  React.useEffect(() => {
    // Access the "feedbackAqui/ecommerces" node within the database
    const ecommerceRef = ref(db, "feedbackAqui/ecommerces");
  
    const unsubscribe = onValue(ecommerceRef, (snapshot: DataSnapshot) => {
      const data = snapshot.val();
      console.log('Data from Firebase:', data); // Log data received from Firebase

      if (data) {
        const dataArray: Ecommerce[] = Object.keys(data).map((key) => {
          const ecommerce = {
            ...data[key],
            id: key, // Adicione o ID do e-commerce
          };
          return ecommerce;
        });
        setEcommerces(dataArray);
      } else {
        console.log('No data available');
        setEcommerces([]);
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [db]);

  console.log('Ecommerces state:', ecommerces); // Log the ecommerces state

  return (
    <Container>
      <Grid>
        {ecommerces.length > 0 ? (
          ecommerces.map((ecommerce) => (
            <Grid.Col key={ecommerce.id} span={4} >
              <CardEcommerce ecommerce={ecommerce} />
            </Grid.Col>
          ))
        ) : (
          <Grid.Col span={12}>
            <Spinner />
          </Grid.Col>
        )}
      </Grid>
    </Container>
  );
};

export default EcommerceData;
