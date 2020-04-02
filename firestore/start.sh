#!/bin/bash

export_path="/firestore/firestore_export/firestore_export.overall_export_metadata"
start_command="/google-cloud-sdk/platform/cloud-firestore-emulator/cloud_firestore_emulator start --host=0.0.0.0 --port=8812"

if [ -e $export_path ]; then
    $start_command --seed_from_export=$export_path &
else
    $start_command &
fi

while true
do
    curl -XPOST -H "Content-Type: application/json" -d "{\"database\": \"projects/$PROJECT_ID/databases/(default)\", \"export_directory\": \"/firestore\", \"export_name\": \"firestore_export\"}" http://0.0.0.0:8812/emulator/v1/projects/$PROJECT_ID:export
    sleep 5
done
