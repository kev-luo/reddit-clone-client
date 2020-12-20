import { Box, Button, Flex, Heading, Link } from "@chakra-ui/react";
import React from "react";
import NextLink from "next/link";

import { DarkModeSwitch } from "./DarkModeSwitch";
import { useLogoutMutation, useMeQuery } from "../generated/graphql";
import { isServer } from "../utils/isServer";

interface NavbarProps {

}

export const Navbar: React.FC<NavbarProps> = ({ }) => {
  // since we added the navbar to the index page which implements SSR, the navbar query is also sending the MeQuery to our Nextjs server where there is no cookie. this means the result will always be null
  const [{ data, fetching }] = useMeQuery({
    pause: isServer()
  });
  const [{fetching: logoutFetching}, logout] = useLogoutMutation();
  let body;


  if (fetching) {
    body = null;
  } else if (!data?.me) {
    body = (
      <>
        <NextLink href="/login" >
          <Link mr={2}>Login</Link>
        </NextLink>
        <NextLink href="/register">
          <Link >Register</Link>
        </NextLink>
      </>
    )
  } else {
    body = (
      <>
        <Box mr={2}>{data?.me?.username}</Box>
        <Button variant="link" onClick={() => logout()} isLoading={logoutFetching}>Logout</Button>
      </>
    )
  }

  return (
    <Flex bg="tomato" p={4} position="sticky" top={0} zIndex={1} alignItems="center">
      <NextLink href="/">
        <Link>
          <Heading>KO-Reddit</Heading>
        </Link>
      </NextLink>
      <Flex ml={'auto'}>
        {body}
        <DarkModeSwitch />
      </Flex>
    </Flex>
  );
}