import React from 'react';
import { Text, Avatar, Group, TypographyStylesProvider, Paper } from '@mantine/core';
import classes from './CommentHtml.module.css';

interface CommentHtmlProps {
  nome: string;
  comentario: string;
  avatarUrl: string;
  tempo: string;
  estrelas: number;
  responses?: { [key: string]: string }[];
}

export const CommentHtml: React.FC<CommentHtmlProps> = ({
  nome,
  comentario,
  avatarUrl,
  tempo,
  estrelas,
  responses = [],
}) => {
  return (
    <Paper withBorder radius="md" className={classes.comment} p="md" mb="md">
      <Group align="center">
        <Avatar src={avatarUrl} alt={nome} radius="xl" />
        <div>
          <Text fz="sm">{nome}</Text>
          <Text fz="xs" c="dimmed">
            {tempo} - {estrelas} estrelas
          </Text>
        </div>
      </Group>
      <TypographyStylesProvider className={classes.body}>
        <div className={classes.content}>
          <div dangerouslySetInnerHTML={{ __html: comentario }} />
        </div>
      </TypographyStylesProvider>
      {responses &&
        responses.map((response, index) => (
          <div key={index} className={classes.response}>
            <Group align="center" ml="md">
              <Avatar src={response.avatarUrl} alt={response.nome} radius="xl" />
              <div>
                <Text fz="sm">{response.nome}</Text>
                <Text fz="xs" c="dimmed">
                  {response.tempo}
                </Text>
              </div>
            </Group>
            <TypographyStylesProvider className={classes.body}>
              <div className={classes.content}>
                <div dangerouslySetInnerHTML={{ __html: response.comentario }} />
              </div>
            </TypographyStylesProvider>
          </div>
        ))}
    </Paper>
  );
};
