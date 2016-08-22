# npm-batch-install

> Install dependencies in batches

## Why?
Installing a project's entire dependency tree at once can be error prone in certain environments (*cough* windows), as an error finalizing a single package will force a rollback of the entire operation.

`npm-batch-install` tries installing dependencies in batches, if a batch fails it tries to install each package in the failing batch individually before giving up and marking it as failed.

You many then install the failed packages using one or more of the techniques below:
* `npm cache clear`
* `npm install --force` <sup>1</sup>
* Turn off your anti-virus <sup>2</sup>
* Restart your computer and hope for the best.

<small>1 Hope you know what you're doing </small> <br />
<small>2 Assuming you have admin rights</small>


## Install
`npm install -g npm-batch-install`

## Usage
`npm-batch-install [options]`

| Option  |  Default | Description
|-|-:|-|
|`-B --batch-size=<num>`|`4`|The batch size|
