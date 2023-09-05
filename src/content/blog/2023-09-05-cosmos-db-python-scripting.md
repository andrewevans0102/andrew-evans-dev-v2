---
title: Cosmos DB Python Scripting
pubDate: 2023-09-05T15:00:08.861Z
snippet: "In light of everything going on with the Coronavirus, I thought it might be helpful to do a short post covering different video conferencing applications. Many folks are working remotely, and it woul"
heroImage: /images/COSMOS_DB_WITH_PYTHON.jpg
tags: ["azure", "python"]
---

Recently I've been working a lot with an Azure Cosmos DB instance. I ran into an issue where I wanted to easily query and edit data, but also have my work saved in a way I could easily run later. Azure already has a data explorer where I can do queries, but I wanted to have scripts that I could use to run routine cleanup and other functions. After some research, I came upon the [Azure Cosmos DB Python SDK](https://azuresdkdocs.blob.core.windows.net/$web/python/azure-cosmos/4.0.0/index.html). With the Python SDK, I was able to build out some basic scripts that I could use in my day to day tasks. Additionally, when I do things like bug fixes and other maintenance tasks I could script out what I did to refer to in the future. In this post I'm going to walkthrough a sample of what I did, and demonstrate ways that you could do the same for your project. My sample project [is available on GitHub](https://github.com/andrewevans0102/cosmos-db-python-scripting) and I'd recommend doing a clone of that to follow along.

## Prequiste Packages

In order to work with the Azure Cosmos DB Python SDK, you should already have your local machine setup with Python and the appropriate packages. The [Azure Tutorial](https://learn.microsoft.com/en-us/azure/cosmos-db/nosql/quickstart-python?tabs=azure-portal%2Cpasswordless%2Clinux%2Csign-in-azure-cli%2Csync) outlines most of this setup, but just for reference i specifically had to add the following two packages with pip3:

```bash
pip3 install azure-cosmos
pip3 install azure-identity
```

I also used [Python Pandas](https://pandas.pydata.org/) for the data load portion, but this wasn't necessary if you do not want to use Pandas.

## Setting up your Script

For all the scripts that I used with the Azure Cosmos DB Python SDK, I instantiated a database and container object I could interact with. I had those values stored locally in a `.env` file, and read them in with the Python package `dotenv`:

```python
import os
from azure.cosmos import CosmosClient
from azure.identity import DefaultAzureCredential
from dotenv import load_dotenv

# https://dev.to/jakewitcher/using-env-files-for-environment-variables-in-python-applications-55a1
load_dotenv()

endpoint = os.environ["COSMOS_ENDPOINT"]
database_id = os.environ["DATABASE_ID"]
container_id = os.environ["CONTAINER_ID"]
account_key = os.environ["COSMOS_KEY"]

credential = DefaultAzureCredential()
client = CosmosClient(url=endpoint, credential=account_key)

# database
db = client.get_database_client(database_id)
# container
container = db.get_container_client(container_id)
```

## Loading Data

The Azure Cosmos DB Python SDK allows you to do all the basic Create, Read, Update, and Delete (CRUD) functions. If you already have data setup, loading may not necessarily be requried. However, you can still use the Python SDK's insert commands to create values if you needed to do a batch upload to your Cosmos DB instance.

In my sample project, if you look at the file `scripts/data_load.py` you'll see I did this with some sample Electronic Vehicle Data. I retrieved the vehicle data from [catalog.data.gov](https://catalog.data.gov/dataset/electric-vehicle-population-data) and used it for my research since it was free and a fairly large dataset.

To upload values into a Cosmos DB instance, I used Python Pandas to read in the `.csv` file and then the Azure `create_item` function and did the following:

```python
# read in original data file
df = pd.read_csv("../data/ELECTRIC_VEHICLE_POPULATION_DATA.csv")

# loop through file and save each value to the Cosmos DB container
for index, row in df.iterrows():
    # capping at 10000 values but if you wanted more change the value here
    if(index < 10000):
        try:
            new_item = {
                "id": str(uuid.uuid4()),
                "VIN": row["VIN"],
                "County": row["County"],
                "City": row["City"],
                "State": row["State"],
                "PostalCode": row["Postal Code"],
                "ModelYear": row["Model Year"],
                "Make": row["Make"],
                "Model": row["Model"],
                "ElectricVehicleType": row["Electric Vehicle Type"],
                "CAFVEligability": row["Clean Alternative Fuel Vehicle (CAFV) Eligibility"],
                "ElectricRange": row["Electric Range"],
                "BaseMSRP": row["Base MSRP"],
                "LegislativeDistrict": row["Legislative District"],
                "DOLVehicleId": row["DOL Vehicle ID"],
                "VehicleLocation": row["Vehicle Location"],
                "ElectricUtility": row["Electric Utility"],
                "2020CensusTract": row["2020 Census Tract"]
            }

            container.create_item(new_item)
            print(f"value loaded with ${new_item} \n")
        except Exception:
            print(Exception)
    else:
        break
```

With that, my database was loaded and I could do the CRUD operations. You could use the `create_item` function to individually add data values to a Cosmos DB container in any script as well.

## Querying Data

When you work with Cosmos DB, one of the most frequent things you'll have to do is to query data. You may need to look for a specific value, or pull a set of records that may need to be fixed. Whatever the case, you can use the `query_items` function to directly pass in a query and retrieve values. In my sample project, I did this in the `scripts/data-query.py` file with the following two functions:

```python
def query_values_with_vin(container, vin):
    # https://azuresdkdocs.blob.core.windows.net/$web/python/azure-cosmos/4.0.0/index.html#query-the-database
    for item in container.query_items(
            query=f'SELECT * FROM mycontainer r WHERE r.VIN="{vin}"',
            enable_cross_partition_query=True):
        print(json.dumps(item, indent=True))

def query_values_with_city(container, city):
    # https://azuresdkdocs.blob.core.windows.net/$web/python/azure-cosmos/4.0.0/index.html#query-the-database
    for item in container.query_items(
            query=f'SELECT * FROM mycontainer r WHERE r.City="{city}"',
            enable_cross_partition_query=True):
        print(json.dumps(item, indent=True))
```

Since my data was all electric vehicles, the Vehicle Identification Number (VIN) was important. I also knew that something like City, would potentially be important with this data so I wrote two functions to showcase the `query_items` function in action.

If you notice in the `SELECT` clause of the query I specify a `WHERE` to select the values I need. I could further customize this query for a more refined search.

## Deleting Data

Deleting data may also be a normal function for you. Especially in a situation where you need to maintain a Cosmos DB instance and potentially cleanup errors from customers.

In my sample project, in the `scripts/data_delete.py` I used the `delete_item` function from the SDK to be able to delete individual records that I had retrieved. I started with a query function to get values based on a VIN:

```python
def query_values_with_vin(container, vin):
    response = []
    # https://azuresdkdocs.blob.core.windows.net/$web/python/azure-cosmos/4.0.0/index.html#query-the-database
    for item in container.query_items(
            query=f'SELECT * FROM mycontainer r WHERE r.VIN="{vin}"',
            enable_cross_partition_query=True):
        response.append(item)
    return response
```

Then I passed in the items and individually deleeted them by calling the delete function on each individually:

```python
def delete_values(container, queried_values):
    for item in queried_values:
        # when deleting in a cosmos DB instance make sure to specify the right partition key
        # in the sample table I am using id but it could be anything you specifiy
        container.delete_item(item=item["id"], partition_key=item["id"])
```

When doing any of the CRUD operations, you probably want to add logging and exception handling. In these examples, I've made them necessarily simple and left out logging and exception handling.

## Updating Data

Finishing out the CRUD operations, updating is also a routine task that you will usually have to do if you maintain a Comsos DB instance. In my sample project, in the file `scripts/data_update.py` I first query the cosmos instance for vehicles with a specific VIN:

```python
def query_values_with_vin(container, vin):
    response = []
    # https://azuresdkdocs.blob.core.windows.net/$web/python/azure-cosmos/4.0.0/index.html#query-the-database
    for item in container.query_items(
            query=f'SELECT * FROM mycontainer r WHERE r.VIN="{vin}"',
            enable_cross_partition_query=True):
        print(json.dumps(item, indent=True))
        response.append(item)
    return response
```

With the values queried, I then modify one of the fields (in this case the `ElectricVehicleType` field):

```python
# change the value of the ElectronicVehicleType to something else
for item in queried_values:
    item["ElectricVehicleType"] = "hey this is an update of the electronic vehicle type"
```

With the values updated locally, I then perist them to the Cosmos DB instance with the `upsert_item` function:

```python
# in Azure updating and inserting is considered an Upsert
# modified from the upsert_item function at https://github.com/Azure/azure-sdk-for-python/blob/main/sdk/cosmos/azure-cosmos/samples/document_management.py#L106-L111
def update_value(container, updated_value):
    container.upsert_item(body=updated_value)
```

Then I just query the values again to verify that the updates have been saved:

```python
# query again to show the change has saved
print("query values again and show update second \n")
queried_values = query_values_with_vin(container, QUERY_VIN)
```

## Conclusion

In this post, I showed a few examples of using the Azure Cosmos DB Python SDK to script out some routine functions that developers do daily. The nice part about having these scripts is that you can easily run them again if you're routinely asked to do things like data cleanup. I recommend checking out my sample project, and also reading through the [Azure Tutorial](https://learn.microsoft.com/en-us/azure/cosmos-db/nosql/quickstart-python?tabs=azure-portal%2Cpasswordless%2Clinux%2Csign-in-azure-cli%2Csync). Having things like data operations scripted make work less error prone, and easier in the lifetime of an application. I've covered basics in this post, but you can take the examples and do more extensive work with any Cosmos DB project.
