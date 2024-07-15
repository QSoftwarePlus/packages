#!/bin/bash

declare -a arr=("car" "moto" "health-insurance-fund" "insurer" "worker-compensation-insurer")

for dbname in "${arr[@]}"
do
    cd ./$dbname
    ./docker.sh
    echo "Restored $dbname"
    cd ..
done