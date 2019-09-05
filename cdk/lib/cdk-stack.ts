import cdk = require('@aws-cdk/core');
import ec2 = require('@aws-cdk/aws-ec2');
import ecs = require('@aws-cdk/aws-ecs');
import ecs_patterns = require('@aws-cdk/aws-ecs-patterns');
import {SecurityGroup} from "@aws-cdk/aws-ec2";

export class CdkStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = ec2.Vpc.fromLookup(
        this,
        'VPC',
        {
          vpcName: 'VPC_NAME'
        },
    );

    const sg = ec2.SecurityGroup.fromSecurityGroupId(this, "SecurityGroup", 'SECURITY_GROUP_ID');

    const cluster = ecs.Cluster.fromClusterAttributes(this,
        'staging-app-servers', {
          clusterName: "CLUSTER_NAME",
          securityGroups: [sg],
          vpc: vpc
        });

    // Create a load-balanced Fargate service and make it public
    new ecs_patterns.LoadBalancedFargateService(this, "MyFargateServiceCDKTest", {
      cluster: cluster, // Required
      cpu: 256, // Default is 256
      desiredCount: 1, // Default is 1
      image: ecs.ContainerImage.fromRegistry("amazon/amazon-ecs-sample"), // Required
      memoryLimitMiB: 512, // Default is 512
      publicLoadBalancer: true // Default is false
    });
  }
}
