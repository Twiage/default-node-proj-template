#!/usr/bin/env node
import 'source-map-support/register';
import cdk = require('@aws-cdk/core');
import { CdkStack } from '../lib/cdk-stack';

const app = new cdk.App();
new CdkStack(app, 'CdkStack', { env: {
        region: 'AWS_REGION',
        account: 'AWS_ACCOUNT_ID',
    }
});
