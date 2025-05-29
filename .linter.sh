#!/bin/bash
cd /home/kavia/workspace/code-generation/warmconnect-27284-9ac6b676/warmconnect_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

