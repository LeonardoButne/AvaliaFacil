import React, { useState } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/database';
import 'firebase/compat/firestore';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Container, TextInput, PasswordInput, Select, Button, Paper, Title, Text, Group } from '@mantine/core';
import { firebaseConfig } from '../../Config/FirebaseConfig';
import { useNavigate } from 'react-router-dom';


// Inicialize o Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}



const provinces = [
    "Maputo",
    "Gaza",
    "Inhambane",
    "Sofala",
    "Manica",
    "Tete",
    "Zambezia",
    "Nampula",
    "Cabo Delgado",
    "Niassa"
];

const cities: { [key: string]: string[] } = {
    "Maputo": ["Maputo City", "Matola"],
    "Gaza": ["Chókwè", "Xai-Xai"],
    "Inhambane": ["Inhambane City", "Maxixe"],
    "Sofala": ["Beira"],
    "Manica": ["Chimoio"],
    "Tete": ["Tete City"],
    "Zambezia": ["Quelimane"],
    "Nampula": ["Nampula City", "Nacala"],
    "Cabo Delgado": ["Pemba"],
    "Niassa": ["Lichinga"]
};

const CadastroConsumidor: React.FC = () => {
    const [fullName, setFullName] = useState('');
    const [biNumber, setBiNumber] = useState('');
    const [birthdate, setBirthdate] = useState<Date | null>(null);
    const [gender, setGender] = useState('');
    const [province, setProvince] = useState('');
    const [city, setCity] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();

    const handleCadastroSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (password !== confirmPassword) {
            alert("As senhas não coincidem.");
            return;
        }

        try {
            const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
            const userId = userCredential.user?.uid;

            if (userId) {
                await firebase.database().ref('feedbackAqui').child("consumidores").child(userId).set({
                    isAdmin: false,
                    isRemoved: false,
                    isSuspended: false,
                    nome: fullName,
                    bi: biNumber,
                    dataNascimento: birthdate ? birthdate.toISOString() : null,
                    genero: gender,
                    provincia: province,
                    cidade: city,
                    email: email,
                    celular: phone,
                    senha: password
                });
            }

            setFullName('');
            setBiNumber('');
            setBirthdate(null);
            setGender('');
            setProvince('');
            setCity('');
            setEmail('');
            setPhone('');
            setPassword('');
            setConfirmPassword('');

            alert("Usuário cadastrado com sucesso!");
            navigate('/login')
        } catch (error) {
            alert("Erro ao cadastrar usuário. Verifique o console para mais detalhes.");
        }
    };

    return (
        <Container size={600} my={40}>
            <Title mb={20}>Cadastro</Title>
            <Paper withBorder shadow="md" p={30} radius="md">
                <form onSubmit={handleCadastroSubmit}>
                    <Text size="lg">Dados pessoais</Text>
                    <TextInput
                        label="Nome e sobrenome (Conforme escrito no seu BI)"
                        value={fullName}
                        onChange={(e) => setFullName(e.currentTarget.value)}
                        required
                    />
                    <TextInput
                        label="NO. do BI"
                        value={biNumber}
                        onChange={(e) => setBiNumber(e.currentTarget.value)}
                        maxLength={13}
                        required
                    />
                    <TextInput
                        label="Data de Nascimento"
                        component={() => (
                            <DatePicker
                                selected={birthdate}
                                onChange={(date: Date | null) => setBirthdate(date)}
                                dateFormat="dd/MM/yyyy"
                                placeholderText="dd/mm/aaaa"
                                className="mantine-input"
                            />
                        )}
                    />
                    <Select
                        label="Gênero"
                        placeholder="Selecione o gênero"
                        data={["Masculino", "Feminino"]}
                        value={gender}
                        onChange={(value) => setGender(value || '')}
                        required
                    />
                    <Select
                        label="Provincia"
                        placeholder="-Selecione a provincia-"
                        data={provinces}
                        value={province}
                        onChange={(value) => setProvince(value || '')}
                        required
                    />
                    <Select
                        label="Cidade"
                        placeholder="Selecione a provincia primeiro"
                        data={province ? cities[province] : []}
                        value={city}
                        onChange={(value) => setCity(value || '')}
                        disabled={!province}
                        required
                    />
                    <Text size="lg" mt="md">Dados de acesso</Text>
                    <TextInput
                        label="Email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.currentTarget.value)}
                        required
                    />
                    <TextInput
                        label="Celular"
                        type="tel"
                        maxLength={9}
                        value={phone}
                        onChange={(e) => setPhone(e.currentTarget.value)}
                        required
                    />
                    <PasswordInput
                        label="Crie uma senha"
                        value={password}
                        onChange={(e) => setPassword(e.currentTarget.value)}
                        required
                    />
                    <Text size="sm" color="dimmed">
                        Sua senha deve ter:<br />
                        - 8 ou mais caracteres<br />
                        - Letras maiúsculas e minúsculas<br />
                        - Pelo menos um número<br />
                        - Nível médio ou alto de segurança<br />
                        - Não use informações pessoais, caracteres ou números em sequência, exemplo: (123, abc...)
                    </Text>
                    <PasswordInput
                        label="Confirmar senha"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.currentTarget.value)}
                        required
                    />
                    <Group align="center" mt="xl">
                        <Button type="submit">Cadastre-se</Button>
                    </Group>
                </form>
            </Paper>
        </Container>
    );
};

export default CadastroConsumidor;
