tsc -b && \
export STACK_NAME=cup-domain-test && \
sam package --template template2.yaml --output-template-file packaged.yaml --s3-bucket sam.us-east-1.otto-aws.com --region us-east-1 && \
sam deploy --template-file packaged.yaml --stack-name ${STACK_NAME} \
--capabilities CAPABILITY_IAM --parameter-overrides UserPoolArn=arn:aws:cognito-idp:us-east-1:520945424137:userpool/us-east-1_nUeV2oote --region us-east-1
