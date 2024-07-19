import React, { useState } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/database';
import 'firebase/compat/storage';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Container, TextInput, Select, Button, Paper, Title, Group } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { firebaseConfig } from '../../Config/FirebaseConfig';

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

const CadastroEcommerce: React.FC = () => {
    const [ecommerceName, setEcommerceName] = useState('');
    const [category, setCategory] = useState('');
    const [province, setProvince] = useState<string>('');
    const [city, setCity] = useState('');
    const [website, setWebsite] = useState('');
    const [phone, setPhone] = useState('');
    const [contactEmail, setContactEmail] = useState('');
    const [legalRepresentative, setLegalRepresentative] = useState('');
    const [foundationDate, setFoundationDate] = useState<Date | null>(null);
    const [profileImage, setProfileImage] = useState<File | null>(null);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();

    const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setProfileImage(e.target.files[0]);
        }
    };

    const handleCadastroSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (password !== confirmPassword) {
            alert("As senhas não correspondem.");
            return;
        }

        if (!profileImage) {
            alert("Por favor, selecione uma imagem de perfil.");
            return;
        }

        const storageRef = firebase.storage().ref();
        const profileImageRef = storageRef.child(`profileImages/${profileImage.name}`);

        try {
            await profileImageRef.put(profileImage);
            const url = await profileImageRef.getDownloadURL();

            // Criar usuário no Firebase Authentication
            const userCredential = await firebase.auth().createUserWithEmailAndPassword(contactEmail, password);
            const user = userCredential.user;

            if (user) {
                const ecommerceData = {
                    ecommerce_name: ecommerceName,
                    category,
                    provinceSelect: province,
                    citySelect: city,
                    website,
                    phone,
                    contact_email: contactEmail,
                    legal_representative: legalRepresentative,
                    foundation_date: foundationDate ? foundationDate.toISOString() : '',
                    profileImage: url,
                    suspended: false,
                    userId: user.uid // Adicionar userId aqui
                };

                // Salvar os dados do e-commerce no Realtime Database
                const db = firebase.database().ref("feedbackAqui/ecommerces");
                await db.child(user.uid).set(ecommerceData);

                alert("E-commerce cadastrado com sucesso!");
                setEcommerceName('');
                setCategory('');
                setProvince('');
                setCity('');
                setWebsite('');
                setPhone('');
                setContactEmail('');
                setLegalRepresentative('');
                setFoundationDate(null);
                setProfileImage(null);
                setPassword('');
                setConfirmPassword('');
                navigate('/login');
            }
        } catch (error) {
            console.error("Erro ao cadastrar e-commerce:", error);
            alert("Erro ao cadastrar e-commerce. Verifique o console para mais detalhes.");
        }
    };

    return (
        <Container size={600} my={40}>
            <Title mb={20}>Cadastro de E-commerce</Title>
            <Paper withBorder shadow="md" p={30} radius="md">
                <form onSubmit={handleCadastroSubmit}>
                    <TextInput
                        label="Nome do E-commerce"
                        value={ecommerceName}
                        onChange={(e) => setEcommerceName(e.currentTarget.value)}
                        required
                    />
                    <Select
                        label="Categoria"
                        placeholder="Selecione a categoria"
                        data={["Eletrônicos", "Moda", "Alimentos", "Móveis", "Esportes"]}
                        value={category}
                        onChange={(value) => setCategory(value || '')}
                        required
                    />
                    <Select
                        label="Província"
                        placeholder="Selecione a província"
                        data={provinces}
                        value={province}
                        onChange={(value) => setProvince(value || '')}
                        required
                    />
                    <Select
                        label="Cidade"
                        placeholder="Selecione a cidade"
                        data={province ? cities[province] : []}
                        value={city}
                        onChange={(value) => setCity(value || '')}
                        disabled={!province}
                        required
                    />
                    <TextInput
                        label="Website ou link da página na rede social"
                        value={website}
                        onChange={(e) => setWebsite(e.currentTarget.value)}
                    />
                    <TextInput
                        label="Telefone"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.currentTarget.value)}
                        required
                    />
                    <TextInput
                        label="Email de Contato"
                        type="email"
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.currentTarget.value)}
                        required
                    />
                    <TextInput
                        label="Representante Legal"
                        value={legalRepresentative}
                        onChange={(e) => setLegalRepresentative(e.currentTarget.value)}
                        required
                    />
                    <TextInput
                        label="Data de Fundação"
                        component={() => (
                            <DatePicker
                                selected={foundationDate}
                                onChange={(date: Date | null) => setFoundationDate(date)}
                                dateFormat="dd/MM/yyyy"
                                placeholderText="dd/mm/aaaa"
                                className="mantine-input"
                            />
                        )}
                    />
                    <TextInput
                        label="Imagem de Perfil"
                        type="file"
                        accept="image/*"
                        onChange={handleProfileImageChange}
                        required
                    />
                    <TextInput
                        label="Senha"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.currentTarget.value)}
                        required
                    />
                    <TextInput
                        label="Confirmar Senha"
                        type="password"
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

export default CadastroEcommerce;
