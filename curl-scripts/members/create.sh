#!/bin/bash

API="http://localhost:4741"
URL_PATH="/members"

curl "${API}${URL_PATH}" \
  --include \
  --request POST \
  --header "Content-Type: application/json" \
  --header "Authorization: Bearer ${TOKEN}" \
  --data '{
    "member": {
      "name": "'"${NAME}"'",
      "risk": "'"${RISK}"'",
      "balance": "'"${BALANCE}"'"
    }
  }'

echo
