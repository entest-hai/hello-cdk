import {
  aws_lambda,
  aws_lambda_event_sources,
  aws_sqs,
  Stack,
  StackProps,
} from "aws-cdk-lib";
import { Construct } from "constructs";
import * as path from "path";

export class HelloCdkStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // sqs
    const queue = new aws_sqs.Queue(this, "HelloQueue", {
      queueName: "HelloQueue",
    });

    // lambda
    const fn = new aws_lambda.Function(this, "HelloFunction", {
      functionName: "HelloLambda",
      runtime: aws_lambda.Runtime.PYTHON_3_8,
      code: aws_lambda.Code.fromAsset(path.join(__dirname, "./../lambda")),
      handler: "handler.handler",
    });

    // lambda event source - sqs queue
    fn.addEventSource(new aws_lambda_event_sources.SqsEventSource(queue));
  }
}
