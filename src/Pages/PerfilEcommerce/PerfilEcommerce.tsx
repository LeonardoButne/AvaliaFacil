import React, { useEffect, useState } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/database';
import { useNavigate } from 'react-router-dom';
import { Container, Card, Grid, Text, Title, Group, Button, Textarea, Center, Paper, ScrollArea } from '@mantine/core'; // Importe Scrollbar do Mantine
import { CommentHtml } from '../../Components/CommentHtml/CommentHtml';

const firebaseConfig = {
    // Configuração do Firebase
    apiKey: "AIzaSyA5W3WDwlAgF8Qn5ptmZ4V4JvVaHQ5KBEk",
    authDomain: "feedback-aqui.firebaseapp.com",
    databaseURL: "https://feedback-aqui-default-rtdb.firebaseio.com",
    projectId: "feedback-aqui",
    storageBucket: "feedback-aqui.appspot.com",
    messagingSenderId: "390730068105",
    appId: "1:390730068105:web:4f9c564b63192d6ddc5658",
    measurementId: "G-4V5LL17MRE"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

const feedbackAquiDB2 = firebase.database().ref("feedbackAqui");

const EcommerceProfile: React.FC = () => {
    const [ecommerce, setEcommerce] = useState<any>(null);
    const [ecommerceId, setEcommerceId] = useState<string | null>(null);
    const [avaliacoes, setAvaliacoes] = useState<number[]>([]);
    const [comentarios, setComentarios] = useState<{ nome: string; comentario: string; estrelas: number }[]>([]);
    const [starRating, setStarRating] = useState<number | null>(null);
    const [comment, setComment] = useState<string>('');

    const navigate = useNavigate();

    useEffect(() => {
        const pathParts = window.location.pathname.split('/');
        const ecommerceName = decodeURIComponent(pathParts[pathParts.length - 1]);
        if (ecommerceName) {
            feedbackAquiDB2.child("ecommerces").orderByChild("ecommerce_id").equalTo(ecommerceId).on("value", (snapshot) => {
                snapshot.forEach((childSnapshot) => {
                    const data = childSnapshot.val();
                    setEcommerce(data);
                    setEcommerceId(childSnapshot.key);
                });
            });
        }
    }, []);

    useEffect(() => {
        if (ecommerceId) {
            feedbackAquiDB2.child("avaliacoes").orderByChild("ecommerceId").equalTo(ecommerceId).on("value", (snapshot) => {
                const newAvaliacoes: number[] = [];
                const comentariosPromises: Promise<{ nome: string; comentario: string; estrelas: number }>[] = [];

                snapshot.forEach((childSnapshot) => {
                    const data = childSnapshot.val();
                    newAvaliacoes.push(data.starRating);

                    const userPromise = feedbackAquiDB2.child("consumidores").child(data.userId).once("value")
                        .then((userSnapshot) => {
                            const userData = userSnapshot.val();
                            const nomeUsuario = userData.nome || "Nome não encontrado";
                            return { comentario: data.comment, nome: nomeUsuario, estrelas: data.starRating };
                        })
                        .catch((error) => {
                            console.error("Erro ao obter dados do usuário:", error);
                            return { comentario: data.comment, nome: "Erro ao obter nome do usuário", estrelas: data.starRating };
                        });

                    comentariosPromises.push(userPromise);
                });

                Promise.all(comentariosPromises)
                    .then((comentarios) => {
                        // Limitar para 4 comentários
                        setComentarios(comentarios);
                        setAvaliacoes(newAvaliacoes);
                    })
                    .catch((error) => {
                        console.error("Erro ao obter dados do usuário:", error);
                    });
            });
        }
    }, [ecommerceId]);

    const handleRatingSubmit = () => {
        if (starRating && comment.trim() !== "") {
            const user = firebase.auth().currentUser;
            if (user && ecommerceId) {
                const userId = user.uid;
                feedbackAquiDB2.child("consumidores").child(userId).once("value")
                    .then((snapshot) => {
                        const userData = snapshot.val();
                        const userName = userData.nome;

                        const feedbackData = {
                            ecommerceId: ecommerceId,
                            userId: userId,
                            userName: userName,
                            starRating: starRating,
                            comment: comment
                        };

                        const newFeedbackRef = feedbackAquiDB2.child("avaliacoes").push();
                        newFeedbackRef.set(feedbackData);

                        setComment('');
                        alert("Avaliação enviada com sucesso!");
                    })
                    .catch((error) => {
                        console.error("Erro ao buscar dados do usuário:", error);
                    });
            } else {
                navigate('/login');
            }
        } else {
            alert("Por favor, selecione uma classificação antes de enviar.");
        }
    };

    const calcularMedia = (avaliacoes: number[]) => {
        if (avaliacoes.length === 0) {
            return 0;
        }

        let total = 0;
        for (let i = 0; i < avaliacoes.length; i++) {
            total += Number(avaliacoes[i]);
        }

        return total / avaliacoes.length;
    };

    const handleStarClick = (value: number) => {
        setStarRating(value);
    };

    return (
        <Container>
            <Center>
                <Title order={1}>Perfil do E-commerce</Title>
            </Center>
            <Grid gutter="lg" justify="center">
                <Grid.Col span={6}>
                    <Card shadow="sm" padding="lg">
                        {ecommerce && (
                            <>
                                <Title order={2}>{ecommerce.ecommerce_name}</Title>
                                <Text><strong>Categoria:</strong> {ecommerce.category}</Text>
                                <Text><strong>Website:</strong> <a href={ecommerce.website} target="_blank" rel="noopener noreferrer">{ecommerce.website}</a></Text>
                                <Text><strong>Província:</strong> {ecommerce.provinceSelect}</Text>
                                <Text><strong>Cidade:</strong> {ecommerce.citySelect}</Text>
                                <Text><strong>Telefone:</strong> {ecommerce.phone}</Text>
                                <Text><strong>Email de Contato:</strong> {ecommerce.contact_email}</Text>
                                <Text><strong>Representante Legal:</strong> {ecommerce.legal_representative}</Text>
                                <Text><strong>Data de Fundação:</strong> {ecommerce.foundation_date}</Text>
                                <Text><strong>Média de Avaliações:</strong> {calcularMedia(avaliacoes).toFixed(1)}</Text>
                            </>
                        )}
                    </Card>
                </Grid.Col>
                <Grid.Col span={6}>
                    <Card shadow="sm" padding="lg">
                        <Title order={2}>Comentários sobre {ecommerce?.ecommerce_name}</Title>
                        <ScrollArea>
                            <div>
                                {comentarios.map((comentario, index) => (
                                    <CommentHtml
                                        key={index}
                                        nome={comentario.nome}
                                        comentario={comentario.comentario}
                                        avatarUrl="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-2.png"
                                        tempo="Há algum tempo" // Pode ajustar para mostrar o tempo real
                                        estrelas={comentario.estrelas}
                                    />
                                ))}
                            </div>
                        </ScrollArea>
                    </Card>
                </Grid.Col>
            </Grid>
            <Card shadow="sm" padding="lg" mt="xl">
                <Title order={2}>Deixe sua avaliação</Title>
                <Center>
                    <Group align="center" >
                        {[1, 2, 3, 4, 5].map((value) => (
                            <div
                                key={value}
                                className={`star-icon ${starRating && starRating >= value ? 'ativo' : ''}`}
                                onClick={() => handleStarClick(value)}
                                style={{ cursor: 'pointer', fontSize: '2rem', color: starRating && starRating >= value ? '#f5b50a' : '#ccc' }}
                            >
                                ★
                            </div>
                        ))}
                    </Group>
                </Center>
                <Textarea
                    label="Comentário"
                    placeholder="Digite seu comentário aqui"
                    minRows={4}
                    value={comment}
                    onChange={(e) => setComment(e.currentTarget.value)}
                />
                <Button onClick={handleRatingSubmit} mt="md">
                    Enviar Avaliação
                </Button>
            </Card>
        </Container>
    );
};

export default EcommerceProfile;
