---
title: Python Pandas Cheat Sheet
pubDate: 2023-08-28T15:59:46.347Z
snippet: "Recently I've been working a lot with Python Pandas to do some financial analysis, and wanted to share a cheat sheet for anyone new to Pandas. If you're not familiar, Pandas is an open source"
heroImage: /images/PYTHON_PANDAS_TITLE_LOGO.png
tags: ["python", "analytics"]
---

Recently I've been working a lot with [Python Pandas](https://pandas.pydata.org/) to do some financial analysis, and wanted to share a cheat sheet for anyone new to Pandas. If you're not familiar, Pandas is an open source data analysis library that makes it easy to manipulate and mine datasets. Specifically I was using it to compare various financial transactions against a budget, but there are a wide range of possibilities. You can even connect it to [Jupyter Notebooks](https://jupyter.org/) for reports as well. The following sections are a cheat sheet of common things that you can do with Pandas. There is a ton of things you can do with Pandas, but the following are examples I found useful.

#### Creating a Dataframe from a Local Object

```python
import pandas as pd

# define data in a local variable
data = {'Name': ['Luke Skywalker', 'Han Solo', 'Leia Organa', "Obi-Wan Kenobi", "Darth Vader", "Lando Calrissian"],
        'Age': [28, 32, 28, 65, 55, 42]}

# read in local data to dataframe
df = pd.DataFrame(data)

# show output
print(df)
#                Name  Age
# 0    Luke Skywalker   28
# 1          Han Solo   32
# 2       Leia Organa   28
# 3    Obi-Wan Kenobi   65
# 4       Darth Vader   55
# 5  Lando Calrissian   42
```

#### Saving a Dataframe to a CSV File

```python
import pandas as pd

# define data in a local variable
data = {'Name': ['Luke Skywalker', 'Han Solo', 'Leia Organa', "Obi-Wan Kenobi", "Darth Vader", "Lando Calrissian"],
        'Age': [28, 32, 28, 65, 55, 42]}

# read in local data to dataframe
df = pd.DataFrame(data)

# create file for output
df.to_csv("output.csv",index=False)
# file should look something like this
# Name,Age
# Luke Skywalker,28
# Han Solo,32
# Leia Organa,28
# Obi-Wan Kenobi,65
# Darth Vader,55
# Lando Calrissian,42
```

#### Saving a Dataframe as an Excel Spreadsheet

```python
import pandas as pd

# define data in a local variable
data = {'Name': ['Luke Skywalker', 'Han Solo', 'Leia Organa', "Obi-Wan Kenobi", "Darth Vader", "Lando Calrissian"],
        'Age': [28, 32, 28, 65, 55, 42]}

# read in local data to dataframe
df = pd.DataFrame(data)

# create files for output
df.to_excel("spreadsheet.xlsx",index=False)
```

#### Reading in from a CSV

```python
import pandas as pd

# read in file from above examples with Star Wars characters
df = pd.read_csv("output.csv")

# show output
print(df)
#                Name  Age
# 0    Luke Skywalker   28
# 1          Han Solo   32
# 2       Leia Organa   28
# 3    Obi-Wan Kenobi   65
# 4       Darth Vader   55
# 5  Lando Calrissian   42
```

#### Creating an Empty Dataframe and Adding Records

```python
import pandas as pd

# create dataframe for output
created_df = pd.DataFrame([], columns=["name", "actual", "budget", "diff", "status"])

# create a new dataframe with values
new_df = pd.DataFrame([["lightsaber", 5, 10, 5, "equal"]], columns=["name", "actual", "budget", "diff", "status"])

# concatenate the two dataframes together
created_df = pd.concat([created_df, new_df])

# print the result
print(created_df)
# output
#                   name actual budget diff status
# 0  lightsaber purchase      5     10    5  equal
```

#### Iterating Over All Values in a Dataframe

```python
import pandas as pd

# define data in a local variable
data = {'Name': ['Luke Skywalker', 'Han Solo', 'Leia Organa', "Obi-Wan Kenobi", "Darth Vader", "Lando Calrissian"],
        'Age': [28, 32, 28, 65, 55, 42]}

# read in local data to dataframe
df = pd.DataFrame(data)

# update the replace json with
for index, row in df.iterrows():
    # show the value by referencing the row
    print(f'access the value at the row as an object \n {row["Name"]} is {row["Age"]}')
    # show the value by referencing the index
    print(f"access the value at the index \n {df.at[index, 'Name']} is {df.at[index, 'Age']}")
```

#### Adding a Column to a Dataframe

```python
import pandas as pd

# define data in a local variable
data = {'Name': ['Luke Skywalker', 'Han Solo', 'Leia Organa', "Obi-Wan Kenobi", "Darth Vader", "Lando Calrissian"],
        'Age': [28, 32, 28, 65, 55, 42]}

# read in local data to dataframe
df = pd.DataFrame(data)

# Add a new column
df['group'] = ["rebellion", "rebellion", "rebellion", "rebellion", "empire", "rebellion"]

# Display the DataFrame
print(df)
# output
#                Name  Age      group
# 0    Luke Skywalker   28  rebellion
# 1          Han Solo   32  rebellion
# 2       Leia Organa   28  rebellion
# 3    Obi-Wan Kenobi   65  rebellion
# 4       Darth Vader   55     empire
# 5  Lando Calrissian   42  rebellion
```

#### Removing Specific Columns from a Dataframe

```python
import pandas as pd

# define data in a local variable
data = {'Name': ['Luke Skywalker', 'Han Solo', 'Leia Organa', "Obi-Wan Kenobi", "Darth Vader", "Lando Calrissian"],
        'Age': [28, 32, 28, 65, 55, 42]}

# read in local data to dataframe
df = pd.DataFrame(data)

# show output
print(df)
#                Name  Age
# 0    Luke Skywalker   28
# 1          Han Solo   32
# 2       Leia Organa   28
# 3    Obi-Wan Kenobi   65
# 4       Darth Vader   55
# 5  Lando Calrissian   42

df = df.drop(columns="Age")

# show output
print(df)
# output
#                Name
# 0    Luke Skywalker
# 1          Han Solo
# 2       Leia Organa
# 3    Obi-Wan Kenobi
# 4       Darth Vader
# 5  Lando Calrissian
```

#### Removing Specific Rows from a Dataframe

```python
import pandas as pd

# define data in a local variable
data = {'Name': ['Luke Skywalker', 'Han Solo', 'Leia Organa', "Obi-Wan Kenobi", "Darth Vader", "Lando Calrissian"],
        'Age': [28, 32, 28, 65, 55, 42]}

# read in local data to dataframe
df = pd.DataFrame(data)

# show output
print(df)
#                Name  Age
# 0    Luke Skywalker   28
# 1          Han Solo   32
# 2       Leia Organa   28
# 3    Obi-Wan Kenobi   65
# 4       Darth Vader   55
# 5  Lando Calrissian   42

df = df[df["Name"].str.contains("Luke Skywalker") == False]

# show output
print(df)
#                Name  Age
# 1          Han Solo   32
# 2       Leia Organa   28
# 3    Obi-Wan Kenobi   65
# 4       Darth Vader   55
# 5  Lando Calrissian   42
```

#### Applying a Function to All Values in a Dataframe Column

```python
import pandas as pd

# define data in a local variable
data = {'Name': ['Luke Skywalker', 'Han Solo', 'Leia Organa', "Obi-Wan Kenobi", "Darth Vader", "Lando Calrissian"],
        'Age': [28, 32, 28, 65, 55, 42]}

# read in local data to dataframe
df = pd.DataFrame(data)

# show output before applying value
print("values original")
print(df)

# increase the age by 1
df['Age'] = df['Age'].apply(lambda x: x + 1)

# show output after applying value
print("values incremented")
print(df)
```

## Conclusion

I hope this cheat sheet helps you as a reference. There are a lot more things you can do with Python Pandas, but these should get you started.
