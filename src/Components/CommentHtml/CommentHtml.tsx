import React from 'react';
import { Text, Avatar, Group, TypographyStylesProvider, Paper, Center } from '@mantine/core';
import classes from './CommentHtml.module.css';

interface CommentHtmlProps {
  nome: string;
  comentario: string;
  avatarUrl: string;
  tempo: string;
  estrelas: number;
}

export const CommentHtml: React.FC<CommentHtmlProps> = ({ nome, comentario, avatarUrl, tempo, estrelas }) => {
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
    </Paper>
  );
};
