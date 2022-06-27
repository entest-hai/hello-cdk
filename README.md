# Introduction to Cloud Development Kit

- [elad: re:invent 2018](https://www.youtube.com/watch?v=Lh-kVC2r2AU)
- [elad: re:invent 2019](https://www.youtube.com/watch?v=9As_ZIjUGmY&list=LL&index=221)

[Elad-Ben Israel](https://thecdkbook.com/foreword.html) - the creator of CDK joined Amazon in 2016. Then CDK first released in JUL 2019. Quoted from him
 
```In early 2016, I joined a group of Amazon engineers who were exploring hardware utilization in one of the most important and large-scale services behind Amazon.com—Amazon Product Search. One piece of this solution required processing, in real time, all activity from Amazon.com to determine which products were being purchased...```

## CDK Concept 



## CDK CLI Workflow 

### Init a project 
```bash 
cdk init --language typescript 
```
### Project Structure 
```
|--build
   |--hello-cdk.ts
|--lib
   |--hello-cdk-stack.ts
|--lambda
   |--handler.py 
|--cdk.out
   |--HelloCdkStack.template.json
|--cdk.json
```
### Synthesize Templates
synthesize cloudformation templates. Then templates stored in cdk.out
```bash 
cdk synth 
```
the default cdk synth synthesize a ts file specified by cdk.json   
```bash 
 "app": "npx ts-node --prefer-ts-exts bin/hello-cdk.ts"
```
we can override it by (this means we can write multiple apps)
```bash 
cdk --app 'npx ts-node --prefer-ts-exts bin/my-app.ts' synth
```
### Deploy Stacks
if there is one stack 
```bash
cdk deploy
```
deploy a specific stack in multiple stacks 
```bash 
cdk deploy "HelloCdkStack"
```
if deploy all stacks in the app 
```bash 
cdk deploy --all 
```

### Destroy Stacks 
if there is only one stack 
```bash 
cdk destroy 
```
destroy a specific stack in multiple stacks 
```bash 
cdk destroy "HelloCdkStack"
```
destroy all stacks in the app 
```bash 
cdk destroy --all 
```

## App, Stack, and Construct 
create an app 
```tsx
// create an app 
const app = new cdk.App();

// a stack inside the app 
new HelloCdkStack(app, "HelloCdkStack", {
  env: {
    region: process.env.CDK_DEFAULT_REGION, 
    account: process.env.CDK_DEFAULT_ACCOUNT,
  },
});
```

create an stack 
```tsx
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

    // lambda event source sqs queue
    fn.addEventSource(new aws_lambda_event_sources.SqsEventSource(queue));
  }
}
```
here **[aws_sqs](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_sqs.Queue.html)** is a L2 construct. 

### Create your own construct 
```tsx
```
