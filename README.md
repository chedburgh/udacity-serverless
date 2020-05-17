# Udacity Serverless

A simple Todo application built on aws lambdas + serverless framework.

## Functionality

This application allows the creating/removing/updating/fetching of TODO items. Each TODO item can optionally have an attachment image. Each user only has access to TODO items that he/she has created.

## Testing

Clone the repository then run the backend locally:

```bash
git clone https://github.com/chedburgh/udacity-serverless.git
cd udacity-serverless/backend
npm i
npm run start
```

The `client/src/config.ts` file is set correctly for the deployed serverless AWS application.

## Screenshots

Directory [screenshots](screenshots) containms the following:

- Image of [Xray Trace](screenshots/xray_trace.png) after using the backends functionality
- Image of [Logs](screenshots/logs.png)
