import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";

export interface AuthAtEdgeProps {
  semanticVersion?: string;
  cloudFormationParameters?: {
    /**
     * The email address of the user that will be created in the Cognito User Pool. Leave empty to skip user creation.
     * Default: ""
     */
    EmailAddress?: string;

    /**
     * The URL path that should handle the redirect from Cognito after sign-in.
     * Default: /parseauth
     */
    RedirectPathSignIn?: string;

    /**
     * The URL path that should handle the redirect from Cognito after sign-out.
     * Default: /
     */
    RedirectPathSignOut?: string;

    /**
     * The URL path that should handle the JWT refresh request.
     * Default: /refreshauth
     */
    RedirectPathAuthRefresh?: string;

    /**
     * The URL path that you can visit to sign-out.
     * Default: /signout
     */
    SignOutUrl?: string;

    /**
     * If you intend to use one or more custom domain names for the CloudFront distribution, please set that up yourself on the CloudFront distribution after deployment. If you provide those domain names now (comma-separated) the necessary Cognito configuration will already be done for you (unless you're bringing your own User Pool from a different AWS account). Alternatively, update the Cognito configuration yourself after deployment: add sign-in and sign-out URLs for your custom domains to the user pool app client settings.
     * Default: ""
     */
    AlternateDomainNames?: string[];

    /**
     * The settings for the cookies holding e.g. the JWTs. To be provided as a JSON object, mapping cookie type to setting. Provide the setting for the particular cookie type as a string, e.g. "Path=/; Secure; HttpOnly; Max-Age=1800; SameSite=Lax". If left to null, a default setting will be used that should be suitable given the value of "EnableSPAMode" parameter.
     * Default: { "idToken": null, "accessToken": null, "refreshToken": null, "nonce": null }
     */
    CookieSettings?: {
      idToken?: string | null;
      accessToken?: string | null;
      refreshToken?: string | null;
      nonce?: string | null;
    };

    /**
     * The OAuth scopes to request the User Pool to add to the access token JWT.
     * Default: "phone, email, profile, openid, aws.cognito.signin.user.admin"
     */
    OAuthScopes?: string[];

    /**
     * The HTTP headers to set on all responses from CloudFront. To be provided as a JSON object.
     * Default: { "Content-Security-Policy": "default-src 'none'; img-src 'self'; script-src 'self' https://code.jquery.com https://stackpath.bootstrapcdn.com; style-src 'self' 'unsafe-inline' https://stackpath.bootstrapcdn.com; object-src 'none'; connect-src 'self' https://*.amazonaws.com https://*.amazoncognito.com", "Strict-Transport-Security": "max-age=31536000; includeSubdomains; preload", "Referrer-Policy": "same-origin", "X-XSS-Protection": "1; mode=block", "X-Frame-Options": "DENY", "X-Content-Type-Options": "nosniff" }
     */
    HttpHeaders?: {
      [key: string]: string;
    };

    /**
     * Set to false to disable SPA-specific features (i.e. when deploying a static site that won't interact with logout/refresh).
     * Default: true
     */
    EnableSPAMode?: boolean;

    /**
     * Set to false to skip the creation of a CloudFront distribution and associated resources, such as the private S3 bucket and the sample React app. This may be of use to you, if you just want to create the Lambda@Edge functions to use with your own CloudFront distribution.
     * Default: true
     */
    CreateCloudFrontDistribution?: boolean;

    /**
     * Specify whether naming of cookies should be compatible with AWS Amplify (default) or Amazon Elasticsearch Service. In case of the latter, turn off SPA mode too: set parameter EnableSPAMode to false.
     * Default: "amplify"
     * AllowedValues: "amplify", "elasticsearch"
     */
    CookieCompatibility?: "amplify" | "elasticsearch";

    /**
     * Specify one or more additional cookies to set after successful sign-in. Specify as a JSON object––mapping cookie names to values and settings: {"cookieName1": "cookieValue1; HttpOnly; Secure"}
     * Default: {}
     */
    AdditionalCookies?: {
      [key: string]: string;
    };

    /**
     * Specify the ARN of an existing user pool to use that one instead of creating a new one. If specified, then UserPoolClientId must also be specified. Also, the User Pool should have a domain configured.
     * Default: ""
     */
    UserPoolArn?: string;

    /**
     * The auth domain of the existing User Pool, whose ARN you specified as UserPoolArn, e.g. "my-domain.auth.<region>.amazoncognito.com". If you don't provide this value, it will be looked up for you automatically. This automatic lookup only works if the pre-existing User Pool is in the same AWS account as this stack, so if it's not, make sure to explicitly specify the UserPoolAuthDomain.
     * Default: ""
     */
    UserPoolAuthDomain?: string;

    /**
     * Specify the ID of an existing user pool client to use that one instead of creating a new one. If specified, then UserPoolArn must also be specified. Note: new callback URL's will be added to the pre-existing user pool client (but only if it's in the same AWS account as this stack).
     * Default: ""
     */
    UserPoolClientId?: string;

    /**
     * The client secret of the existing User Pool Client, whose ClientId you specified as UserPoolClientId. If you don't provide this value, it will be looked up for you automatically. This automatic lookup only works if the pre-existing User Pool Client is in the same AWS account as this stack, so if it's not, make sure to explicitly specify the UserPoolClientSecret.
     * Default: ""
     */
    UserPoolClientSecret?: string;

    /**
     * Specify a group that users have to be part of to view the private site. Use this to further protect your private site, in case you don't want every user in the User Pool to have access. The UserPoolGroup will be created if the UserPool is also created (that happens when no UserPoolArn is set). If the UserPoolGroup is created and the default user is also created (when you specify EmailAddress), that user will also be added to the group.
     * Default: ""
     */
    UserPoolGroupName?: string;

    /**
     * Changing this parameter after initial deployment forces redeployment of Lambda@Edge functions.
     * Default: "2.3.0"
     */
    Version?: string;

    /**
     * Use for development: setting to a value other than none turns on logging at that level. Warning! This will log sensitive data, use for development only.
     * Default: "none"
     * AllowedValues: "none", "info", "warn", "error", "debug"
     */
    LogLevel?: "none" | "info" | "warn" | "error" | "debug";

    /**
     * ARN of a boundary policy if your organisation uses some for roles, optional.
     * Default: ""
     */
    PermissionsBoundaryPolicyArn?: string;

    /**
     * Do you want to append "index.html" to paths that end with a slash ("/")?
     * Default: false
     */
    RewritePathWithTrailingSlashToIndex?: boolean;

    /**
     * AWS WAF Web ACL Id, if any, to associate with this distribution.
     * Default: ""
     */
    WebACLId?: string;

    /**
     * The object that you want CloudFront to request from your origin (for example, index.html) when a viewer requests the root URL for your distribution (http://www.example.com).
     * Default: index.html
     */
    DefaultRootObject?: string;

    /**
     * The S3 origin you want to front with CloudFront. Specify the bucket's region specific hostname, i.e. <bucket-name>.s3.<region>.amazonaws.com, and (optionally) also specify the parameter OriginAccessIdentity. If you don't provide an origin, and "CreateCloudFrontDistribution" is set to "true" (the default), then an S3 bucket will be created for you.
     * Default: ""
     */
    S3OriginDomainName?: string;

    /**
     * The custom origin you want to front with CloudFront. If using an existing S3 bucket (in non-website mode), don't use this parameter, specify parameter "S3OriginDomainName" instead. If you don't provide an origin, and "CreateCloudFrontDistribution" is set to "true" (the default), then an S3 bucket will be created for you.
     * Default: ""
     */
    CustomOriginDomainName?: string;

    /**
     * The HTTP header name of the (secret) custom header that you want CloudFront to send to your custom origin. Also specify parameter "CustomOriginHeaderValue". Only of use if you are also specifying parameter "CustomOriginDomainName".
     * Default: ""
     */
    CustomOriginHeaderName?: string;

    /**
     * The HTTP header value of the (secret) custom header that you want CloudFront to send to your custom origin. Also specify parameter "CustomOriginHeaderName". Only of use if you are also specifying parameter "CustomOriginDomainName".
     * Default: ""
     */
    CustomOriginHeaderValue?: string;

    /**
     * The Origin Access Identity you want to associate with your S3 origin, e.g. 'ABCDEFGHIJKLMN'.
     * Default: ""
     */
    OriginAccessIdentity?: string;

    /**
     * The (pre-existing) Amazon S3 bucket to store CloudFront access logs in, for example, myawslogbucket.s3.amazonaws.com. Only of use if "CreateCloudFrontDistribution" is set to "true" (the default).
     * Default: ""
     */
    CloudFrontAccessLogsBucket?: string;

    /**
     * The suffix to use for Lambda function names. Use this to disambiguate between multiple deployments of this application.
     * Default: ""
     */
    ResourceSuffix?: string;
  };
}

export class CdkConstruct extends Construct {
  public readonly authAtEdgeApplication: cdk.aws_sam.CfnApplication;
  public readonly s3Bucket: cdk.aws_s3.IBucket;
  public readonly websiteUrl: string;
  public readonly cloudFrontDistribution: cdk.aws_cloudfront.IDistribution;
  public readonly userPool: cdk.aws_cognito.IUserPool;
  public readonly userPoolClient: cdk.aws_cognito.IUserPoolClient;
  public readonly userPoolClientSecret: string;
  public readonly cognitoAuthDomain: string;
  public readonly redirectUrisSignIn: string;
  public readonly redirectUrisSignOut: string;
  public readonly parseAuthHandler: cdk.aws_lambda.IFunction;
  public readonly checkAuthHandler: cdk.aws_lambda.IFunction;
  public readonly httpHeadersHandler: cdk.aws_lambda.IFunction;
  public readonly refreshAuthHandler: cdk.aws_lambda.IFunction;
  public readonly signOutHandler: cdk.aws_lambda.IFunction;
  public readonly trailingSlashHandler: cdk.aws_lambda.IFunction;
  public readonly codeUpdateHandler: cdk.aws_lambda.IFunction;
  public readonly userPoolClientUpdateHandler: cdk.aws_lambda.IFunction;

  constructor(scope: Construct, id: string, props: AuthAtEdgeProps = {}) {
    super(scope, id);

    const parameters =
      props.cloudFormationParameters &&
      Object.fromEntries(
        Object.entries(props.cloudFormationParameters)
          .filter(([, v]) => v !== undefined)
          .map(([k, v]) => {
            if (Array.isArray(v)) {
              return [k, v.join(",")];
            } else if (typeof v === "boolean") {
              return [k, v.toString()];
            } else if (typeof v === "object") {
              return [k, JSON.stringify(v)];
            }
            return [k, v];
          })
      );

    this.authAtEdgeApplication = new cdk.aws_sam.CfnApplication(
      scope,
      `AuthAtEdge${id}`,
      {
        location: {
          applicationId:
            "arn:aws:serverlessrepo:us-east-1:520945424137:applications/cloudfront-authorization-at-edge",
          semanticVersion: props.semanticVersion ?? "2.3.0",
        },
        parameters,
      }
    );
    this.s3Bucket = cdk.aws_s3.Bucket.fromBucketName(
      scope,
      `Bucket${id}`,
      this.authAtEdgeApplication.getAtt("Outputs.S3Bucket").toString()
    );
    this.websiteUrl = this.authAtEdgeApplication
      .getAtt("Outputs.WebsiteUrl")
      .toString();
    this.cloudFrontDistribution =
      cdk.aws_cloudfront.Distribution.fromDistributionAttributes(
        scope,
        `Distribution${id}`,
        {
          domainName: this.authAtEdgeApplication
            .getAtt("Outputs.CloudFrontDomain")
            .toString(),
          distributionId: this.authAtEdgeApplication
            .getAtt("Outputs.CloudFrontDistribution")
            .toString(),
        }
      );
    this.userPool = cdk.aws_cognito.UserPool.fromUserPoolId(
      scope,
      `UserPool${id}`,
      this.authAtEdgeApplication.getAtt("Outputs.UserPoolId").toString()
    );

    this.userPoolClient = cdk.aws_cognito.UserPoolClient.fromUserPoolClientId(
      scope,
      `UserPoolClient${id}`,
      this.authAtEdgeApplication.getAtt("Outputs.ClientId").toString()
    );

    this.userPoolClientSecret = this.authAtEdgeApplication
      .getAtt("Outputs.ClientSecret")
      .toString();

    this.cognitoAuthDomain = this.authAtEdgeApplication
      .getAtt("Outputs.CognitoAuthDomain")
      .toString();

    this.redirectUrisSignIn = this.authAtEdgeApplication
      .getAtt("Outputs.RedirectUrisSignIn")
      .toString();

    this.redirectUrisSignOut = this.authAtEdgeApplication
      .getAtt("Outputs.RedirectUrisSignOut")
      .toString();

    this.parseAuthHandler = cdk.aws_lambda.Function.fromFunctionArn(
      scope,
      `ParseAuthHandler${id}`,
      this.authAtEdgeApplication.getAtt("Outputs.ParseAuthHandler").toString()
    );

    this.checkAuthHandler = cdk.aws_lambda.Function.fromFunctionArn(
      scope,
      `CheckAuthHandler${id}`,
      this.authAtEdgeApplication.getAtt("Outputs.CheckAuthHandler").toString()
    );

    this.httpHeadersHandler = cdk.aws_lambda.Function.fromFunctionArn(
      scope,
      `HttpHeadersHandler${id}`,
      this.authAtEdgeApplication.getAtt("Outputs.HttpHeadersHandler").toString()
    );

    this.refreshAuthHandler = cdk.aws_lambda.Function.fromFunctionArn(
      scope,
      `RefreshAuthHandler${id}`,
      this.authAtEdgeApplication.getAtt("Outputs.RefreshAuthHandler").toString()
    );

    this.signOutHandler = cdk.aws_lambda.Function.fromFunctionArn(
      scope,
      `SignOutHandler${id}`,
      this.authAtEdgeApplication.getAtt("Outputs.SignOutHandler").toString()
    );

    this.trailingSlashHandler = cdk.aws_lambda.Function.fromFunctionArn(
      scope,
      `TrailingSlashHandler${id}`,
      this.authAtEdgeApplication
        .getAtt("Outputs.TrailingSlashHandler")
        .toString()
    );

    this.codeUpdateHandler = cdk.aws_lambda.Function.fromFunctionArn(
      scope,
      `CodeUpdateHandler${id}`,
      this.authAtEdgeApplication.getAtt("Outputs.CodeUpdateHandler").toString()
    );

    this.userPoolClientUpdateHandler = cdk.aws_lambda.Function.fromFunctionArn(
      scope,
      `UserPoolClientUpdateHandler${id}`,
      this.authAtEdgeApplication
        .getAtt("Outputs.UserPoolClientUpdateHandler")
        .toString()
    );
  }
}
