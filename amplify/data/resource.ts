import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

const schema = a.schema({
  Todo: a
    .model({
      content: a.string(),
    })
    .authorization((allow) => [allow.guest()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    // Usar 'apiKey' es la forma más ligera y evita lambdas de autenticación pesadas
    defaultAuthorizationMode: 'apiKey',
  },
});