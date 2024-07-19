import React, { useState } from 'react';
import { Card, Text, Button, Textarea, Avatar, Group, ScrollArea } from '@mantine/core';

interface Response {
  userId: string;
  userName: string;
  response: string;
  timestamp: string;
}

interface CommentHtmlWithResponsesProps {
  nome: string;
  comentario: string;
  avatarUrl: string;
  tempo: string;
  estrelas: number;
  responses: Response[];
  commentId: string;
  onResponseChange: (commentId: string, text: string) => void;
  onResponseSubmit: (commentId: string) => void;
}

const CommentHtmlWithResponses: React.FC<CommentHtmlWithResponsesProps> = ({
  nome,
  comentario,
  avatarUrl,
  tempo,
  estrelas,
  responses,
  commentId,
  onResponseChange,
  onResponseSubmit
}) => {
  const [responseText, setResponseText] = useState<string>('');

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setResponseText(event.currentTarget.value);
    onResponseChange(commentId, event.currentTarget.value);
  };

  const handleSubmit = () => {
    onResponseSubmit(commentId);
  };

  return (
    <ScrollArea h={200} mb="lg">
      <Group>
        <Avatar src={avatarUrl} size={50} radius="xl" />
        <div>
          <Text>{nome}</Text>
          <Text color="dimmed" size="sm">{tempo}</Text>
          <Text mt="sm">{comentario}</Text>
          <Text mt="sm" color="yellow">{'★'.repeat(estrelas)}</Text>
        </div>
      </Group>
      <div>
        {responses.map((response, index) => (
          <Card key={index} shadow="xs" padding="md" mt="md">
            <Group>
              <Avatar src={avatarUrl} size={40} radius="xl" />
              <div>
                <Text>{response.userName}</Text>
                <Text color="dimmed" size="sm">{new Date(response.timestamp).toLocaleString()}</Text>
                <Text mt="sm">{response.response}</Text>
              </div>
            </Group>
          </Card>
        ))}
      </div>
      <Textarea
        placeholder="Escreva sua resposta..."
        value={responseText}
        onChange={handleChange}
        mt="md"
        disabled={false}
      />
      <Button onClick={handleSubmit} mt="md" disabled={responseText.trim() === ""}>
        Enviar Resposta
      </Button>
    </ScrollArea>
  );
};

export default CommentHtmlWithResponses;
