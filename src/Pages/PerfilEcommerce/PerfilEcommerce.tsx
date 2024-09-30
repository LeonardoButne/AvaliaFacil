import React, { useEffect, useState } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/database';
import { useNavigate } from 'react-router-dom';
import { Container, Card, Grid, Text, Title, Group, Button, Textarea, Center, Paper, ScrollArea, Avatar, Box, LoadingOverlay } from '@mantine/core'; // Importe ScrollArea do Mantine
import { CommentHtml } from '../../Components/CommentHtml/CommentHtml';
import classes from './PerfilEcommerce.module.css';
import { firebaseConfig } from '../../Config/FirebaseConfig';

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
    const [loading, setLoading] = useState<boolean>(true); // Estado para controlar o overlay

    const navigate = useNavigate();

    useEffect(() => {
        const pathParts = window.location.pathname.split('/');
        const ecommerceName = decodeURIComponent(pathParts[pathParts.length - 1]);
        if (ecommerceName) {
            feedbackAquiDB2.child("ecommerces").orderByChild("ecommerce_name").equalTo(ecommerceName).on("value", (snapshot) => {
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
            setLoading(true); // Mostrar overlay quando inicia o carregamento
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
                        setComentarios(comentarios);
                        setAvaliacoes(newAvaliacoes);
                    })
                    .catch((error) => {
                        console.error("Erro ao obter dados do usuário:", error);
                    })
                    .finally(() => {
                        setLoading(false); // Ocultar overlay após o carregamento
                    });
            });
        }
    }, [ecommerceId]);

    const handleRatingSubmit = () => {
        if (starRating && comment.trim() !== "") {
            const user = firebase.auth().currentUser;
            if (user && ecommerceId) {
                setLoading(true); // Mostrar overlay enquanto processa o envio
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
                        return newFeedbackRef.set(feedbackData);
                    })
                    .then(() => {
                        setComment('');
                        alert("Avaliação enviada com sucesso!");
                    })
                    .catch((error) => {
                        console.error("Erro ao buscar dados do usuário:", error);
                    })
                    .finally(() => {
                        setLoading(false); // Ocultar overlay após o envio
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
        <Container style={{ marginTop: '40px' }}>
            <Box pos="relative">
                <LoadingOverlay visible={loading} loaderProps={{ children: 'Loading...' }} />
                <Center>
                    <Title order={1}>Perfil do E-commerce</Title>
                </Center>
                <Grid gutter="lg" justify="center">
                    <Grid.Col span={15}>
                        <Card padding="md" className={classes.ecommerceCard}>
                            {ecommerce && (
                                <>
                                    <Avatar
                                        src={ecommerce.profileImage}
                                        alt={ecommerce.ecommerce_name}
                                        size="150"
                                        radius="100%"
                                        className={classes.avatar}
                                        style={{ border: '2px solid #f5b50a' }}
                                    />
                                    <div className={classes.infoContainer}>
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
                                    </div>
                                </>
                            )}
                        </Card>
                    </Grid.Col>

                    <Grid.Col span={10}>
                        <Card shadow="sm" padding="lg" style={{ marginTop: '40px' }}>
                            <Title order={2}>Comentários sobre {ecommerce?.ecommerce_name}</Title>
                            <ScrollArea h={450}>
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
                        <Group align="center">
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
            </Box>
        </Container>
    );
};

export default EcommerceProfile;
