#!/usr/bin/env bash

apt install -y jq 

awslocal s3 mb s3://feelgood
awslocal ses verify-email-identity --email-address noreply@feelgood.com.ar
awslocal s3api put-bucket-cors --bucket feelgood --cors-configuration file://cors.json

awslocal sns create-topic --name claim_created
awslocal sns create-topic --name integration_connected
awslocal sns create-topic --name offer_agreement_signed
awslocal sns create-topic --name user_created

awslocal sqs create-queue --queue-name feelgood-execute-file-validations
awslocal sqs create-queue --queue-name feelgood-notification-event
awslocal sqs create-queue --queue-name feelgood-scrape-sinister-data
awslocal sqs create-queue --queue-name feelgood-generate-exported-report
awslocal sqs create-queue --queue-name feelgood-configure-integration-connected
awslocal sqs create-queue --queue-name feelgood-sync-agreement-documents
awslocal sqs create-queue --queue-name feelgood-sync-claim-inspections
awslocal sqs create-queue --queue-name feelgood-sync-user-assignments

awslocal sns subscribe --topic-arn arn:aws:sns:us-east-1:000000000000:claim_created --protocol sqs --notification-endpoint arn:aws:sqs:us-east-1:000000000000:feelgood-execute-file-validations
awslocal sns subscribe --topic-arn arn:aws:sns:us-east-1:000000000000:claim_created --protocol sqs --notification-endpoint arn:aws:sqs:us-east-1:000000000000:feelgood-scrape-sinister-data
awslocal sns subscribe --topic-arn arn:aws:sns:us-east-1:000000000000:claim_created --protocol sqs --notification-endpoint arn:aws:sqs:us-east-1:000000000000:feelgood-sync-claim-inspections
awslocal sns subscribe --topic-arn arn:aws:sns:us-east-1:000000000000:integration_connected --protocol sqs --notification-endpoint arn:aws:sqs:us-east-1:000000000000:feelgood-configure-integration-connected
awslocal sns subscribe --topic-arn arn:aws:sns:us-east-1:000000000000:user_created --protocol sqs --notification-endpoint arn:aws:sqs:us-east-1:000000000000:feelgood-sync-user-assignments

awslocal sns subscribe --topic-arn arn:aws:sns:us-east-1:000000000000:offer_agreement_signed --protocol sqs --notification-endpoint arn:aws:sqs:us-east-1:000000000000:feelgood-sync-agreement-documents


EXECUTE_FILE_VALIDATIONS_SUB_ARN=$(awslocal sns list-subscriptions | jq -r '.Subscriptions[0].SubscriptionArn')
SCRAPE_SINISTER_DATA_SUB_ARN=$(awslocal sns list-subscriptions | jq -r '.Subscriptions[1].SubscriptionArn')
CONFIGURE_INTEGRATION_CONNECTED_SUB_ARN=$(awslocal sns list-subscriptions | jq -r '.Subscriptions[2].SubscriptionArn')
SYNC_AGREEMENT_DOCUMENTS_SUB_ARN=$(awslocal sns list-subscriptions | jq -r '.Subscriptions[3].SubscriptionArn')
USER_CREATED_SUB_ARN=$(awslocal sns list-subscriptions | jq -r '.Subscriptions[4].SubscriptionArn')

awslocal sns set-subscription-attributes --subscription-arn $EXECUTE_FILE_VALIDATIONS_SUB_ARN --attribute-name RawMessageDelivery --attribute-value true
awslocal sns set-subscription-attributes --subscription-arn $SCRAPE_SINISTER_DATA_SUB_ARN --attribute-name RawMessageDelivery --attribute-value true
awslocal sns set-subscription-attributes --subscription-arn $CONFIGURE_INTEGRATION_CONNECTED_SUB_ARN --attribute-name RawMessageDelivery --attribute-value true
awslocal sns set-subscription-attributes --subscription-arn $SYNC_AGREEMENT_DOCUMENTS_SUB_ARN --attribute-name RawMessageDelivery --attribute-value true
awslocal sns set-subscription-attributes --subscription-arn $USER_CREATED_SUB_ARN --attribute-name RawMessageDelivery --attribute-value true
