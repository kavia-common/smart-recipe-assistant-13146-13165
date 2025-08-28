#!/bin/bash
cd /home/kavia/workspace/code-generation/smart-recipe-assistant-13146-13165/frontend_web_app
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

