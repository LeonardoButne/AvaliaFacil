import React from 'react';
import { Text, Avatar, Group, TypographyStylesProvider, Paper } from '@mantine/core';
import classes from './CommentHtml.module.css';

interface Response {
  userName: string;
  response: string;
  avatarUrl: string;
  timestamp: string;
}

interface CommentHtmlProps {
  nome: string;
  comentario: string;
  avatarUrl: string;
  tempo: string;
  estrelas: number;
  responses?: Response[];
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
      {responses.length > 0 && (
        <div className={classes.responses}>
          {responses.map((response, index) => (
            <Paper key={index} withBorder radius="md" className={classes.response} p="md" mt="md">
              <Group align="center">
                <Avatar src={response.avatarUrl} alt={response.userName} radius="xl" />
                <div>
                  <Text fz="sm">{response.userName}</Text>
                  <Text fz="xs" c="dimmed">
                    {new Date(response.timestamp).toLocaleString()}
                  </Text>
                </div>
              </Group>
              <TypographyStylesProvider className={classes.body}>
                <div className={classes.content}>
                  <div dangerouslySetInnerHTML={{ __html: response.response }} />
                </div>
              </TypographyStylesProvider>
            </Paper>
          ))}
        </div>
      )}
    </Paper>
  );
};
