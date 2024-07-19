import React, { useEffect, useState } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/database';
import { useNavigate } from 'react-router-dom';
import { Container, Card, Grid, Text, Title, Group, Button, Textarea, Center, Paper, ScrollArea, Avatar } from '@mantine/core';
import { CommentHtml } from '../../Components/CommentHtml/CommentHtml';
import classes from './PerfilEcommerce.module.css';
import { firebaseConfig } from '../../Config/FirebaseConfig';
import CommentHtmlWithResponses from '../../Components/CommentHtmlWithResponses/CommentHtmlWithResponses';

const EcommerceProfile: React.FC = () => {
    const [ecommerce, setEcommerce] = useState<any>(null);
    const [ecommerceId, setEcommerceId] = useState<string | null>(null);
    const [avaliacoes, setAvaliacoes] = useState<number[]>([]);
    const [comentarios, setComentarios] = useState<any[]>([]);
    const [starRating, setStarRating] = useState<number | null>(null);
    const [comment, setComment] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true); 
    const [response, setResponse] = useState<{ [key: string]: string }>({});

    const navigate = useNavigate();

    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }

    const feedbackAquiDB2 = firebase.database().ref("feedbackAqui");

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
            firebase.database().ref('feedbackAqui/avaliacoes').orderByChild('ecommerceId').equalTo(ecommerceId).on('value', (snapshot) => {
                const newComentarios: any[] = [];
                snapshot.forEach((childSnapshot) => {
                    const data = childSnapshot.val();
                    newComentarios.push({ ...data, commentId: childSnapshot.key });
                });

                const fetchResponses = async () => {
                    for (let comentario of newComentarios) {
                        const responseSnapshot = await firebase.database().ref(`feedbackAqui/avaliacoes/${comentario.commentId}/responses`).once('value');
                        const responses: any[] = [];
                        responseSnapshot.forEach((childSnapshot) => {
                            responses.push(childSnapshot.val());
                        });
                        comentario.responses = responses;
                    }
                    setComentarios(newComentarios);
                };

                fetchResponses();
            });
        }
    }, [ecommerceId]);

    const handleResponseChange = (commentId: string, text: string) => {
        setResponse((prev) => ({ ...prev, [commentId]: text }));
    };

    const handleResponseSubmit = async (commentId: string) => {
        if (response[commentId]?.trim() !== "") {
            const user = firebase.auth().currentUser;
            if (user) {
                try {
                    const userSnapshot = await feedbackAquiDB2.child("consumidores").child(user.uid).once("value");
                    const userData = userSnapshot.val();
                    const userName = userData?.nome || user.email;

                    await firebase.database().ref(`feedbackAqui/avaliacoes/${commentId}/responses`).push({
                        userId: user.uid,
                        userName: userName,
                        response: response[commentId],
                        timestamp: new Date().toISOString(),
                    });

                    setResponse((prev) => ({ ...prev, [commentId]: '' }));
                    alert("Resposta enviada com sucesso!");
                } catch (error) {
                    console.error("Erro ao enviar resposta:", error);
                }
            } else {
                navigate('/login');
            }
        }
    };

    const handleRatingSubmit = () => {
        if (starRating && comment.trim() !== "") {
            const user = firebase.auth().currentUser;
            if (user && ecommerceId) {
                setLoading(true);
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
                        setLoading(false);
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
                        <ScrollArea h={800}>
                            <Title order={2}>Comentários</Title>
                            {comentarios.map((comentario, index) => (
                                <CommentHtmlWithResponses
                                    key={index}
                                    nome={comentario.userName}
                                    comentario={comentario.comentario}
                                    avatarUrl="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-2.png"
                                    tempo="Há algum tempo"
                                    estrelas={comentario.estrelas}
                                    responses={comentario.responses || []}
                                    commentId={comentario.commentId}
                                    onResponseChange={(commentId: string, text: string) => handleResponseChange(commentId, text)}
                                    onResponseSubmit={(commentId: string) => handleResponseSubmit(commentId)}
                                />
                            ))}
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
                    placeholder="Deixe seu comentário aqui..."
                    value={comment}
                    onChange={(event) => setComment(event.currentTarget.value)}
                    mt="md"
                />
                <Button onClick={handleRatingSubmit} mt="md">
                    Enviar Avaliação
                </Button>
            </Card>
        </Container>
    );
};

export default EcommerceProfile;
