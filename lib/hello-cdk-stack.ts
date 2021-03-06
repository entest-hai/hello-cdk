import {
  aws_dynamodb,
  aws_lambda,
  aws_lambda_event_sources,
  aws_sqs,
  RemovalPolicy,
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

    // queuerecorder construct
    new QueueRecorder(this, "QueueRecorder", {
      inputQueue: queue,
    });
  }
}

export interface QueueRecorderProps {
  inputQueue: aws_sqs.Queue;
}

export class QueueRecorder extends Construct {
  constructor(scope: Construct, id: string, props: QueueRecorderProps) {
    super(scope, id);

    // lambda
    const fn = new aws_lambda.Function(this, "HelloFunction", {
      functionName: "HelloLambda",
      runtime: aws_lambda.Runtime.PYTHON_3_8,
      code: aws_lambda.Code.fromAsset(path.join(__dirname, "./../lambda")),
      handler: "handler.handler",
    });

    // lambda event source - sqs queue
    fn.addEventSource(
      new aws_lambda_event_sources.SqsEventSource(props.inputQueue)
    );

    // dynamodb table
    const table = new aws_dynamodb.Table(this, "HelloDynamoDb", {
      tableName: "HelloTable",
      removalPolicy: RemovalPolicy.DESTROY,
      partitionKey: {
        name: "id",
        type: aws_dynamodb.AttributeType.STRING,
      },
    });

    // table name into lambda env
    fn.addEnvironment("TABLE_NAME", table.tableName);

    // grant lambda to write to table
    table.grantWriteData(fn.role!);
  }
}
