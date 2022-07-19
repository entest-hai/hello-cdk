#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { HelloCdkStack } from "../lib/hello-cdk-stack";
import { MyPipelineStack } from "../lib/cdk-pipeline-stack";

const app = new cdk.App();

// application stack
new HelloCdkStack(app, "HelloCdkStack", {
  env: {
    region: process.env.CDK_DEFAULT_REGION,
    account: process.env.CDK_DEFAULT_ACCOUNT,
  },
});

// pipeline stack
new MyPipelineStack(app, "MyPipelineStack", {
  env: {
    region: process.env.CDK_DEFAULT_REGION,
    account: process.env.CDK_DEFAULT_ACCOUNT,
  },
});
