import React, { useEffect, useState } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/database';
import 'firebase/compat/storage';
import { useNavigate } from 'react-router-dom';
import { Container, Card, TextInput, Button, Group, Textarea, Avatar, Title, Grid, Center } from '@mantine/core';
import { CommentHtml } from '../../Components/CommentHtml/CommentHtml';

const EcommerceDashboard: React.FC = () => {
  const [ecommerce, setEcommerce] = useState<any>(null);
  const [ecommerceId, setEcommerceId] = useState<string | null>(null);
  const [comentarios, setComentarios] = useState<any[]>([]);
  const [editedProfile, setEditedProfile] = useState<any>({});
  const [profileImage, setProfileImage] = useState<File | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const user = firebase.auth().currentUser;
    if (user) {
      firebase.database().ref(`feedbackAqui/ecommerces`).orderByChild('userId').equalTo(user.uid).once('value', (snapshot) => {
        snapshot.forEach((childSnapshot) => {
          const data = childSnapshot.val();
          setEcommerce(data);
          setEcommerceId(childSnapshot.key);
          setEditedProfile(data);
        });
      });
    } else {
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    if (ecommerceId) {
      firebase.database().ref('feedbackAqui/avaliacoes').orderByChild('ecommerceId').equalTo(ecommerceId).on('value', (snapshot) => {
        const newComentarios: any[] = [];
        snapshot.forEach((childSnapshot) => {
          const data = childSnapshot.val();
          newComentarios.push(data);
        });
        setComentarios(newComentarios);
      });
    }
  }, [ecommerceId]);

  const handleProfileUpdate = (event: React.FormEvent) => {
    event.preventDefault();
    if (profileImage) {
      const storageRef = firebase.storage().ref();
      const profileImageRef = storageRef.child(`profileImages/${profileImage.name}`);

      profileImageRef.put(profileImage).then(() => {
        profileImageRef.getDownloadURL().then((url) => {
          editedProfile.profileImage = url;
          firebase.database().ref(`feedbackAqui/ecommerces/${ecommerceId}`).update(editedProfile)
            .then(() => {
              alert('Perfil atualizado com sucesso!');
            }).catch(error => {
              console.error('Erro ao atualizar perfil:', error);
            });
        });
      });
    } else {
      firebase.database().ref(`feedbackAqui/ecommerces/${ecommerceId}`).update(editedProfile)
        .then(() => {
          alert('Perfil atualizado com sucesso!');
        }).catch(error => {
          console.error('Erro ao atualizar perfil:', error);
        });
    }
  };

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setProfileImage(e.target.files[0]);
    }
  };

  return (
    <Container size={600} my={40}>
      <Title mb={20}>Painel do E-commerce</Title>
      {ecommerce && (
        <>
          <Card shadow="sm" padding="md" mb="lg">
            <form onSubmit={handleProfileUpdate}>
              <Center>
                <Avatar
                  src={profileImage ? URL.createObjectURL(profileImage) : ecommerce.profileImage}
                  alt={ecommerce.ecommerce_name}
                  size={150}
                  radius="100%"
                />
              </Center>
              <TextInput
                label="Nome do E-commerce"
                value={editedProfile.ecommerce_name}
                onChange={(e) => setEditedProfile({ ...editedProfile, ecommerce_name: e.currentTarget.value })}
                required
              />
              <TextInput
                label="Categoria"
                value={editedProfile.category}
                onChange={(e) => setEditedProfile({ ...editedProfile, category: e.currentTarget.value })}
                required
              />
              <TextInput
                label="Website"
                value={editedProfile.website}
                onChange={(e) => setEditedProfile({ ...editedProfile, website: e.currentTarget.value })}
              />
              <TextInput
                label="Telefone"
                value={editedProfile.phone}
                onChange={(e) => setEditedProfile({ ...editedProfile, phone: e.currentTarget.value })}
                required
              />
              <TextInput
                label="Email de Contato"
                value={editedProfile.contact_email}
                onChange={(e) => setEditedProfile({ ...editedProfile, contact_email: e.currentTarget.value })}
                required
              />
              <TextInput
                label="Representante Legal"
                value={editedProfile.legal_representative}
                onChange={(e) => setEditedProfile({ ...editedProfile, legal_representative: e.currentTarget.value })}
                required
              />
              <TextInput
                label="Data de Fundação"
                value={editedProfile.foundation_date}
                onChange={(e) => setEditedProfile({ ...editedProfile, foundation_date: e.currentTarget.value })}
              />
              <TextInput
                label="Imagem de Perfil"
                type="file"
                accept="image/*"
                onChange={handleProfileImageChange}
              />
              <Group align="center" mt="xl">
                <Button type="submit">Atualizar Perfil</Button>
              </Group>
            </form>
          </Card>

          <Card shadow="sm" padding="md" mb="lg">
            <Title order={2}>Comentários</Title>
            {comentarios.map((comentario, index) => (
              <CommentHtml
                key={index}
                nome={comentario.userName}
                comentario={comentario.comment}
                avatarUrl="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-2.png"
                tempo="Há algum tempo" // Pode ajustar para mostrar o tempo real
                estrelas={comentario.starRating}
              />
            ))}
          </Card>
        </>
      )}
    </Container>
  );
};

export default EcommerceDashboard;
