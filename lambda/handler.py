import os
import logging
import boto3

logger = logging.getLogger()
logger.setLevel(logging.INFO)

def handler(event, context):
    """
    lambda handler
    """
    # log
    logger.info("Hello Lambda")
    # table  
    dynamodb = boto3.resource("dynamodb")
    table = dynamodb.Table(os.environ['TABLE_NAME'])
    # put item to the table 
    for record in event.Records:
        try: 
            body = record['body']
        except:
            body = ''
        table.put_item(
            Item={
                'id': record['messageId'],
                'text': body
        }
    )

