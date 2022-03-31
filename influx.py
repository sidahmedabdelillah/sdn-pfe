from datetime import datetime
import os

from influxdb_client import InfluxDBClient, Point, WritePrecision
from influxdb_client.client.write_api import SYNCHRONOUS

# You can generate an API token from the "API Tokens Tab" in the UI
token = '-m3HtuJ7XruF9PMedquKtKzJdDZYqHBmF_35WQhXjajYXZVFsujR3hCIT5ATGuPxE6D6FvAoAVTHrrMRSn2ujA=='
org = "abdoubentegar@gmail.com"
bucket = "sdn-1"

def write_to_influx(collection="col" , data=""):
    with InfluxDBClient(url="https://eastus-1.azure.cloud2.influxdata.com", token=token, org=org) as client:
        write_api = client.write_api(write_options=SYNCHRONOUS)

        data = "mem,host="+collection+" "+data
        write_api.write(bucket, org, data)

