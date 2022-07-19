import { pipelines, Stack, StackProps, Stage, StageProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { HelloCdkStack } from "./hello-cdk-stack";
import { ProcessingTwitteStack } from "./processing-twitte-stack";

class HelloApplicationStage extends Stage {
  constructor(scope: Construct, id: string, props?: StageProps) {
    super(scope, id, props);

    new HelloCdkStack(this, "HelloCdk");
  }
}

class LambdaApplicationStage extends Stage {
  constructor(scope: Construct, id: string, props: StageProps) {
    super(scope, id, props);

    new ProcessingTwitteStack(this, "ProcessingTwitte");
  }
}

export class MyPipelineStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const pipeline = new pipelines.CodePipeline(this, "Pipeline", {
      synth: new pipelines.ShellStep("Synth", {
        input: pipelines.CodePipelineSource.connection(
          "entest-hai/hello-cdk",
          "master",
          {
            connectionArn: `arn:aws:codestar-connections:${this.region}:${this.account}:connection/f8487d2f-fbf7-4604-8d4c-e672b7d38cf4`,
          }
        ),
        commands: ["npm ci", "npm run build", "npx cdk synth"],
      }),
    });

    // wave parallel deploy
    const wave = pipeline.addWave("WaveParallel");

    // pre-prod app
    wave.addStage(
      new HelloApplicationStage(this, "HelloApp", {
        env: {
          account: this.account,
          region: this.region,
        },
      })
    );

    // prod app
    wave.addStage(
      new LambdaApplicationStage(this, "LambdaApp", {
        env: {
          account: this.account,
          region: this.region,
        },
      })
    );
  }
}
