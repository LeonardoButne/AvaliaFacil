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
} from '@mantine/core';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../Config/FirebaseConfig.ts'; // Ajuste o caminho conforme necessário
import classes from './Login.module.css';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            alert("Entramos");
            navigate('/');
        } catch (error) {
            setError((error as Error).message);
        }
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
                <Button fullWidth mt="xl" onClick={handleLogin}>
                    Sign in
                </Button>
            </Paper>
        </Container>
    );
};

export default Login;
