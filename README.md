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

1. ssr steps
    1.  browser > next.js > graphql api
        1.  browser sends cookie to nextjs. cookie not sent from nextjs to graphql api.
        2.  when page first loads it does SSR so the cookie isn't sent to our graphql API. because of that we're not sending back the vote statuses for the logged in user
        3.  when we make a new post, it invalidates the cache which causes a new request to be sent directly to the graphql api which means the cookie is sent along
2. csr steps
    1.  browser > graphql api
        1.  browser sends cookie to graphql api

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
12. redirect non-logged in users when they visit create post page
13. redirect user back to the page they were on before being redirected to the login page
14. add pagination to posts query
15. invalidate the posts query to refetch all posts from server instead of cache when you post to prevent race-conditions 
16. add voting functionality
17. update cache after voting by reading and writing post fragments
18. query for vote status and read from readFragment
19. create single post page
20. create delete post functionality
21. invalidate single elements from cache for deleting posts
22. create update post page
23. 