#!/bin/bash
java -jar swagger-codegen-cli.jar generate -i ./src/api/swagger.yaml -o ./clientlibs -l typescript-node