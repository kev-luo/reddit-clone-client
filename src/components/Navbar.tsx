import { Box, Button, Flex, Link } from "@chakra-ui/react";
import React from "react";
import NextLink from "next/link";
import { DarkModeSwitch } from "./DarkModeSwitch";
import { useMeQuery } from "../generated/graphql";

interface NavbarProps {

}

export const Navbar: React.FC<NavbarProps> = ({ }) => {
  const [{ data, fetching }] = useMeQuery();
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
        <Button variant="link">Logout</Button>
      </>
    )
  }
  
  return (
    <Flex bg="tomato" p={4}>
      <Flex ml={'auto'}>
        {body}
        <DarkModeSwitch />
      </Flex>
    </Flex>
  );
}