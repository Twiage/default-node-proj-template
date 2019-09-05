#!/usr/bin/env node
import 'source-map-support/register';
import cdk = require('@aws-cdk/core');
import { CdkStack } from '../lib/cdk-stack';

const AWS_REGION=  'us-east-1';
const AWS_ACCOUNT_ID=  '363852383723';

const app = new cdk.App();
new CdkStack(app, 'CdkStack', { env: {
        region: AWS_REGION,
        account: AWS_ACCOUNT_ID,
    }
});
