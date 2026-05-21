import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';

const backend = defineBackend({
  auth,
  data,
});

/**
 * FIX para: 'MemorySize' value failed to satisfy constraint: Member must have value less than or equal to 512
 * 
 * CloudFormation intenta crear funciones con 1536 MB. Este override fuerza 512 MB en TODAS las Lambdas.
 */

const authStack = (backend.auth as any).stack;
const dataStack = (backend.data as any).stack;

[authStack, dataStack].forEach((stack: cdk.Stack) => {
  if (!stack) return;

  stack.node.findAll().forEach((node: any) => {
    if (node instanceof lambda.Function || node instanceof lambda.CfnFunction) {
      const cfnFn = node instanceof lambda.Function 
        ? node.node.defaultChild as lambda.CfnFunction
        : node as lambda.CfnFunction;

      if (cfnFn) {
        cfnFn.addPropertyOverride('MemorySize', 512);
      }
    }

    if (node instanceof cdk.Stack) {
      node.node.findAll().forEach((nestedNode: any) => {
        if (nestedNode instanceof lambda.Function || nestedNode instanceof lambda.CfnFunction) {
          const cfnFn = nestedNode instanceof lambda.Function
            ? nestedNode.node.defaultChild as lambda.CfnFunction
            : nestedNode as lambda.CfnFunction;

          if (cfnFn) {
            cfnFn.addPropertyOverride('MemorySize', 512);
          }
        }
      });
    }
  });
});

export const backend_instance = backend;
export default backend;