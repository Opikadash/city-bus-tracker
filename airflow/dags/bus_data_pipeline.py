from datetime import datetime, timedelta
from airflow import DAG
from airflow.operators.python import PythonOperator
from airflow.providers.amazon.aws.hooks.s3 import S3Hook
from airflow.providers.google.cloud.hooks.bigquery import BigQueryHook
import json
import logging

default_args = {
    'owner': 'city-bus-team',
    'depends_on_past': False,
    'start_date': datetime(2024, 1, 1),
    'email': ['airflow@example.com'],
    'email_on_failure': False,
    'email_on_retry': False,
    'retries': 1,
    'retry_delay': timedelta(minutes=5),
}

dag = DAG(
    'bus_data_pipeline',
    default_args=default_args,
    description='Real-time bus data ETL pipeline',
    schedule_interval=timedelta(minutes=5),
    catchup=False,
    tags=['bus', 'etl', 'cloud'],
)

def extract_s3(**context):
    """Task 1: Fetch recent bus data from S3"""
    s3_hook = S3Hook(aws_conn_id='aws_default')
    # List objects last 10min
    objects = s3_hook.list_keys(bucket_name='city-bus-locations', prefix='bus-data/')
    logging.info(f'Found {len(objects)} bus events')
    context['task_instance'].xcom_push(key='s3_objects', value=objects[:10])  # Recent 10

def transform_data(**context):
    """Task 2: Clean & aggregate"""
    objects = context['task_instance'].xcom_pull(task_ids='extract_s3', key='s3_objects')
    
    # Download & process
    cleaned_data = []
    for obj in objects:
        # s3_hook.get_key(obj).get()['Body'].read()
        # Parse JSON, clean timestamps, calc delays
        cleaned_data.append({'lat': 28.6, 'delay': 5})  # Simulated
    
    aggregates = {
        'busiest_routes': {'1A': 45},
        'avg_delay': 3.2,
        'peak_hour': '17:00'
    }
    
    logging.info('Transform complete')
    context['task_instance'].xcom_push(key='aggregates', value=aggregates)

def load_bigquery(**context):
    """Task 3: Load to warehouse"""
    aggregates = context['task_instance'].xcom_pull(task_ids='transform_data', key='aggregates')
    
    bq_hook = BigQueryHook(gcp_conn_id='bigquery_default')
    # bq_hook.insert_rows(table_id='analytics.bus_metrics', rows=[aggregates])
    logging.info('Loaded to BigQuery/Athena')

def run_analytics(**context):
    """Task 4: SQL analytics"""
    bq_hook = BigQueryHook(gcp_conn_id='bigquery_default')
    sql = """
    SELECT route, AVG(delay) as avg_delay, COUNT(*) as trips
    FROM `project.dataset.bus_events`
    WHERE timestamp > TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 1 HOUR)
    GROUP BY route
    ORDER BY trips DESC
    LIMIT 5
    """
    df = bq_hook.get_pandas_df(sql)
    logging.info(f'Top routes: {df.to_dict()}')

extract = PythonOperator(
    task_id='extract_s3',
    python_callable=extract_s3,
    dag=dag,
)

transform = PythonOperator(
    task_id='transform_data',
    python_callable=transform_data,
    dag=dag,
)

load = PythonOperator(
    task_id='load_bigquery',
    python_callable=load_bigquery,
    dag=dag,
)

analytics = PythonOperator(
    task_id='run_analytics',
    python_callable=run_analytics,
    dag=dag,
)

extract >> transform >> load >> analytics

