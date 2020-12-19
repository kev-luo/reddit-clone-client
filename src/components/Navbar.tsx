import { Box, Flex, Link } from "@chakra-ui/react";
import React from "react";
import NextLink from "next/link";
import { DarkModeSwitch } from "./DarkModeSwitch";
import { useMeQuery } from "../generated/graphql";

interface NavbarProps {

}

export const Navbar: React.FC<NavbarProps> = ({ }) => {
  const [{ data }] = useMeQuery();
  const links = data?.me ? (
    <Box>{data?.me?.username}</Box>
  ) : (
      <>
        <NextLink href="/login" >
          <Link mr={2}>Login</Link>
        </NextLink>
        <NextLink href="/register">
          <Link >Register</Link>
        </NextLink>
      </>
    )
  return (
    <Flex bg="tomato" p={4}>
      <Box ml={'auto'}>
        {links}
        <DarkModeSwitch />
      </Box>
    </Flex>
  );
}