# Reddit Clone - Client
This repo was bootstrapped using the Chakra-UI/Typescript/Nextjs (linked below).

[with-chakra-ui-typescript](https://github.com/vercel/next.js/tree/canary/examples/with-chakra-ui-typescript)


SSR overview
1. browser makes request to http://localhost:3000 (where our website is)
2. that causes a request to be sent to next.js server
3. that causes a request to graphql server on http://localhost:4000/graphql
4. that server builds the HTML and send it back to the browser