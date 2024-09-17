#!/bin/bash

# Define data and log file paths
USERDBPATH="$(brew --prefix)/var/mongodb/cs3219/usersDb"
QUESTIONSDBPATH="$(brew --prefix)/var/mongodb/cs3219/questionsDb"

USERLOGPATH="$(brew --prefix)/var/log/mongodb/cs3219/usersDb/usersDb.log"
QUESTIONLOGPATH="$(brew --prefix)/var/log/mongodb/cs3219/questionsDb/questionsDb.log"

# Create directories for data and logs
mkdir -p $USERDBPATH $QUESTIONSDBPATH
mkdir -p $(dirname $USERLOGPATH) $(dirname $QUESTIONLOGPATH)

# Start MongoDB instances with different ports, data paths, and log paths
mongod --port 27020 --dbpath $USERDBPATH --logpath $USERLOGPATH --fork
mongod --port 27021 --dbpath $QUESTIONSDBPATH --logpath $QUESTIONLOGPATH --fork

echo "MongoDB instances started:"
echo "Instance 1: mongodb://localhost:27020"
echo "Instance 2: mongodb://localhost:27021"
