# default-node-proj-template

## Clone Proj
[Mirror this repo into new repo](https://help.github.com/articles/duplicating-a-repository/)

## Change project name
1. Replace all "default-node-proj-template" with your new project name (i.e. media-services)
1. Change PROJECT_URL in urlPaths.js to be the desired URL (i.e. Project: media-services, PROJECT_URL: media)
1. Change the resources in health.acl.json to match the URL above

### Update Environment variable file
1. Update the variables in .env.example with the staging values in LastPass
1. `cp .env.example .env`
1. Generate a KEY
	* `openssl rand -base64 32`
1. Use KEY from previous step to encrypt file
	* `openssl aes-256-cbc -e -in .env -out ./.circleci/env/{staging|demo|prod} -k {KEY}`
	* `openssl aes-256-cbc -e -in .env -out ./.circleci/env/staging -k jk49aleo4p1-dksf`
1. Save key in Last pass

## CI/CD setup
This project is set up for CircleCI, more will need to be done to set up CI/CD if you use another service or if you want to customize the circleCI config.

### CircleCI setup

#### Enviroment Variables
To set up CircleCI, first add environment variables in CircleCI console:

`AWS_ACCESS_KEY_ID`,  (AWS Console for deployment-nonprod user - entry AWS Access Key Automated Deployment)

`AWS_SECRET_ACCESS_KEY`, (Same as above)

`AWS_ACCOUNT_ID`, (AWS Console, in upper right corner)

`DATADOG_API_KEY` (DataDog => Integrations => API)

`CIPHER_KEY_STAGING` (Created in  `Update Environment variable file` steps above)

`CIPHER_KEY_DEMO` (Created in  `Update Environment variable file` steps above)

`CIPHER_KEY_PRODUCTION` (Created in  `Update Environment variable file` steps above)

#### Slack notification
1. Open project settings (direct link: https://circleci.com/gh/Twiage/default-node-proj-template/edit#hooks)
1. Paste `https://circleci.com/gh/Twiage/api/edit#hooks` into "Slack Webhook URL"
1. Enable "Override room"
1. Type "circleci" as room name
1. Click Save
1. Click & Test Hook
1. Open Slack circleci channel and make sure you see "Hello from CircleCI" message.

### AWS setup

Only need to do once in staging 
1. Create Repository with new project name in ECS
1. Run `yarn deploy:patch`
1. [Create Staging Log Group](https://console.aws.amazon.com/cloudwatch/home?region=us-east-1#logs:) - Naming convention is {project name}-{env}
1. Wait until service deploys in staging => delete the new service created in staging ECS

Create Fargate Service with new project name in ECS for each environment
1. Choose family, should be the name of the service
1. Service name should match project name given above.
1. Choose number of tasks
1. Choose VPC for appropriate env
1. Choose the 2 private subnets
1. Security group should be {ENV}_application-instances
1. Disable Auto assign public IP
1. Application Load balancer {ENV}-api-load-balancer
1. Click Add to load balancer
1. Listener port 443:HTTPS
1. Create new target group with name {project name}-{env}
1. Target group protocol should be HTTP
1. Path pattern should be the same as health check
1. Evaluation order should increment the evaluation order table below
1. Confirm health check URL. (ie for the media-services project => /media/health)
1. Uncheck Enable service discovery integration
1. Next => Next => Create

If you need to add any additional rules to route to our new container
1. Go to {ENV}-api-load-balancer => Listener tab => View/edit rules
1. Add new rule, If : put in new path (or path pattern, ie /project-name*)
1. Then: put forward to your new target group (named {project name}-{env})

**!!!NOTE DO NOT COMMIT UNENCRYPTED ENVIRONMENT FILES!!!**

# Template for default-node-proj-template README
# default-node-proj-template

## Development

### Setting up the environment

1. Install [nvm](https://github.com/creationix/nvm)

macOS or Ubuntu using bash
```bash
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.2/install.sh | bash
```

or if you are using [zsh](https://github.com/robbyrussell/oh-my-zsh/wiki/Installing-ZSH)

```bash
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.2/install.sh | zsh
```

2. Install Node

```bash
nvm install 10.11 && nvm use 10.11
```

3. Install yarn globally

https://yarnpkg.com/lang/en/docs/install/#mac-stable

need [homebrew](https://coolestguidesontheplanet.com/installing-homebrew-on-macos-sierra-package-manager-for-unix-apps/) if you're on MacOS & don't already have it

Change your platform if needed.

## Testing

### Lint

We use ESlint as a linter

To run linter:

```bash
yarn lint
```

To automatically fix some lint errors:
```bash
yarn lint:fix
```

### Run tests

We are using [Jest](https://facebook.github.io/jest/) for unit testing.

We put out tests at the same directory with testing code.
#### Naming conventions

`__system-tests__` - directory name for system tests

`__unit-tests__` - directory name for unit tests

### Unit testing
`yarn` - install dependencies

#### Run unit tests
```bash
yarn test:unit
```

#### Run specific test file
```bash
yarn test:unit -- ./src/modules/notifications/mediators/__unit-tests__/NotificationMediator.test.js
```

you can also run unit tests in watch mode

```bash
yarn test:unit:watch
```

**For mac users**

You need to install [watchman](https://facebook.github.io/watchman/docs/install.html#installing-on-os-x-via-homebrew) using brew

```bash
brew update && brew install watchman
```

### System testing

We use [AVA](https://github.com/avajs/ava) as a testing framework for system tests.

```bash
yarn
```

```bash
yarn test:system
```

*WebStorm users can use run configuration for both unit and system tests. Run configurations are already in repo*

## Deployment

### Environment variables - DO NOT RUN STEPS IF YOU ARE NOT CHANGING ENV VARIABLES
Create and encrypt environment variables:

Copy example and edit .env file

**.env file should contain new line at the end**

```bash
cp .env.example .env
```

Generate a KEY

```bash
openssl rand -base64 32
```

Use KEY from previous step to encrypt file

```bash
openssl aes-256-cbc -e -in .env -out ./.circleci/env/{stage|demo|prod} -k {KEY}
```

Add key to CircleCi as `[default-node-proj-template]CIPHER_KEY_{STAGING|DEMO|PRODUCTION}`

**!!!NOTE DO NOT COMMIT UNENCRYPTED ENVIRONMENT FILES!!!**

### CI server

### Bump a version
1. Use npm to manage versions
```bash
npm version patch
```
Follow [Semiver](http://semver.org/). See `npm version --help` for more information. This will update version in package.json, and add a tag in git.

2. Push tag
```bash
git push --follow-tags
```

CircleCI will trigger deployment by this tag. We use workflows from CircleCI. This will automatically deploy to staging.

### Promoting

### BEFORE DOING ANYTHING

[REVIEW TEAM AGREEMENTS](https://docs.google.com/document/d/1eRPbkjdLwot-lEa-YgVBJCyistBuYH5uDRzknlOMW4k/edit#heading=h.p3yvgogrjuqa)

#### Get task definition:
1. Go to [Workflows](https://circleci.com/gh/Twiage/workflows/default-node-proj-template)
2. Choose your tagged build.
3. Choose **demo_release** or **production_release** job
4. Expand `ecs-cli compose` section. Task definition will be in the console output `INFO[0000] Using ECS task definition                     TaskDefinition="default-node-proj-template:203"`
5. Change `taskDefinition` in JSON above
6. Click “Test” and you’re done.

#### Deployment to demo via Lambda script (automated)
Go to this link: https://console.aws.amazon.com/lambda/home?region=us-east-1#/functions
Click into the lambda_demo_deploy function.
At the top of the screen, there is a dropdown - choose that and Configure test events.
Overwrite the text in there with the JSON below and give it a name (e.g. MessageProcessor).  You can create one of these for each component to deploy.

```json
{
  "taskDefinition": "default-node-proj-template:288",
  "service": "default-node-proj-template"
}
```

#### Deploy via AWS console
TBD

#### Deploy via AWS CLI

 1. Login to AWS CLI using your account

 ```bash
 aws configure
 ```

 **Region**: `us-east-1`

 **Default Output**: `json`


 2. List task definitions and update service
 ```bash
 aws ecs list-task-definitions
 ```

 ```bash
 aws ecs update-service --cluster {staging-app-servers|demo-app-servers|production-ECSCluster-5JKJVZ4KUU75} --service default-node-proj-template --task-definition {revision}` - update service, where revision is ARN like `default-node-proj-template:{REVISION_NUMBER}
 ```

 4. Verify service has been updated
 ```bash
 aws ecs describe-services --cluster {staging-app-servers|demo-app-servers|production-ECSCluster-5JKJVZ4KUU75} --services default-node-proj-template:{REVISION_NUMBER}
 ```

 check `status` and `taskDefinition`

 There should be 2 object in `deployment` section.

## Troubleshooting

Install [awscli](http://docs.aws.amazon.com/cli/latest/userguide/installing.html)

`aws configure` - configure AWS

`eval $(aws ecr get-login --region us-east-1)` - login to Docker registry inside AWS (ECR)

Now you are able to list images and pull it

`aws ecr list-images --repository-name default-node-proj-template` - to list images

`docker pull  363852383723.dkr.ecr.us-east-1.amazonaws.com/default-node-proj-template:{TAG}` - to pull particular image
