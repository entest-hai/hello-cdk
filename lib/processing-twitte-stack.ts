import { Stack, StackProps, aws_lambda } from "aws-cdk-lib";
import { Construct } from "constructs";
import * as path from "path";

export class ProcessingTwitteStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    new aws_lambda.Function(this, "ProcessingTwitteLambda", {
      functionName: "ProcessingTwitteLambda",
      runtime: aws_lambda.Runtime.PYTHON_3_7,
      code: aws_lambda.Code.fromAsset(path.join(__dirname, "./../lambda")),
      handler: "handler.handler",
    });
  }
}
