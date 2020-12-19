# Reddit Clone - Client
This repo was bootstrapped using the Chakra-UI/Typescript/Nextjs (linked below).

[with-chakra-ui-typescript](https://github.com/vercel/next.js/tree/canary/examples/with-chakra-ui-typescript)

```
Technologies Used
- typescript            - urql
- formik                - chakra-ui
- graphql               
- nextjs                
```  

SSR overview
1. browser makes request to http://localhost:3000 (where our website is)
2. that causes a request to be sent to next.js server
3. that causes a request to graphql server on http://localhost:4000/graphql
4. that server builds the HTML and send it back to the browser

Steps
1. set up formik for login and register
2. urql graphql client set up
3. graphql codegen set up
4. register mutation
5. login mutation
6. display form errors upon submission
7. navbar useMeQuery for dynamic links
8. update cache after mutation
9. set up SSR for index page and disable for navbar displayed on index page
10. set up forgot password utility with NodeMailer
11. add create post form along with error handling if someone tries to post without being logged in