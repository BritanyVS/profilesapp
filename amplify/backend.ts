import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';

export const backend = defineBackend({
  auth,
  data,
});

// Force smaller memory for bucket deployment lambdas
const stack = backend.createStack('custom-stack');

stack.templateOptions.description = 'Custom stack to reduce Lambda memory';