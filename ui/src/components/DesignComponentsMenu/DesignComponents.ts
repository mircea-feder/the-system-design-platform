import {DesignComponentCardProps} from "../../interfaces";

export const aws = {
    analytics: [
        {
            imgSrc: "assets/images/aws-icons/analytics/aws_athena.png",
            componentName: "Athena",
            tags: ["aws", "analytics", "query", "sql", "serverless", "data"]
        },
        {
            imgSrc: "assets/images/aws-icons/analytics/aws_datapipeline.png",
            componentName: "Data Pipeline",
            tags: ["aws", "etl", "workflow", "pipeline", "data", "automation"]
        },
    ] as DesignComponentCardProps[],
    compute: [
        {
            imgSrc: "assets/images/aws-icons/compute/aws_apprunner.png",
            componentName: "Athena",
            tags: ["aws", "deployment", "serverless", "managed", "containers"]
        },
        {
            imgSrc: "assets/images/aws-icons/compute/aws_autoscaling.png",
            componentName: "Data Pipeline",
            tags: ["scaling", "performance", "elasticity", "cost", "loadbalancing"]
        },
    ] as DesignComponentCardProps[],
}