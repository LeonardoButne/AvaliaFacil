import React, { useState } from 'react';
import {
    TextInput,
    PasswordInput,
    Checkbox,
    Anchor,
    Paper,
    Title,
    Text,
    Container,
    Group,
    Button,
    LoadingOverlay,
    Box
} from '@mantine/core';
import { auth, firebaseConfig } from '../../Config/FirebaseConfig'; // Ajuste o caminho conforme necessário
import classes from './Login.module.css';
import { useNavigate } from 'react-router-dom';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/database';
import { getApps, initializeApp } from 'firebase/app';

// Initialize Firebase app
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
  const feedbackAquiDB2 = firebase.database().ref("feedbackAqui");

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = (email: string, password: string) => {
        setLoading(true);
        firebase.auth().signInWithEmailAndPassword(email, password)
            .then(async (userCredential) => {
                const user = userCredential.user;
                if (user) {
                    const userId = user.uid;

                    // Verifica se o usuário é um e-commerce
                    const ecommerceSnapshot = await feedbackAquiDB2.child("ecommerces").child(userId).once("value");

                    if (ecommerceSnapshot.exists()) {
                        navigate('/dashboard');
                        return;
                    }

                    // Verifica se o usuário é um consumidor
                    const consumerSnapshot = await feedbackAquiDB2.child("consumidores").child(userId).once("value");

                    
                    if (consumerSnapshot.exists()) {
                        navigate('/'); // Altere para a página do consumidor
                        return;
                    }

                    alert("Tipo de usuário não identificado.");
                    firebase.auth().signOut();
                }
            })
            .catch((error) => {
                console.error('Erro ao fazer login:', error);
                alert('Erro ao fazer login. Verifique suas credenciais.');
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        handleLogin(email, password);
    };

    const handleCreateAccount = () => {
        navigate('/tipo_cadastro'); // Ajuste a rota conforme necessário
    };

    return (
        <Container size={420} my={40}>
            <Title ta="center" className={classes.title}>
                Bem-vindo de volta!
            </Title>
            <Text c="dimmed" size="sm" ta="center" mt={5}>
                Não tem uma conta ainda?{' '}
                <Anchor size="sm" component="button" onClick={handleCreateAccount}>
                    Criar conta
                </Anchor>
            </Text>

            <Paper withBorder shadow="md" p={30} mt={30} radius="md">
                <Box pos="relative">
                    <LoadingOverlay visible={loading} loaderProps={{ children: 'Loading...' }} />
                    <form onSubmit={handleSubmit}>
                        <TextInput
                            label="Email"
                            placeholder="you@mantine.dev"
                            required
                            value={email}
                            onChange={(event) => setEmail(event.currentTarget.value)}
                        />
                        <PasswordInput
                            label="Password"
                            placeholder="Your password"
                            required
                            mt="md"
                            value={password}
                            onChange={(event) => setPassword(event.currentTarget.value)}
                        />
                        {error && <Text color="red">{error}</Text>}
                        <Group justify="space-between" mt="lg">
                            <Checkbox label="Remember me" />
                            <Anchor component="button" size="sm">
                                Forgot password?
                            </Anchor>
                        </Group>
                        <Button fullWidth mt="xl" type="submit" disabled={loading}>
                            Sign in
                        </Button>
                    </form>
                </Box>
            </Paper>
        </Container>
    );
};

export default Login;
