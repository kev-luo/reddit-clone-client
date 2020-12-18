import { Box, Flex, Link } from "@chakra-ui/react";
import React from "react";
import NextLink from "next/link";

interface NavbarProps {

}

export const Navbar: React.FC<NavbarProps> = ({}) => {
    return (
      <Flex bg="tomato" p={4}>
        <Box ml={'auto'}>
          <NextLink href="/login" >
            <Link mr={2}>Login</Link>
          </NextLink>
          <NextLink href="/register">
            <Link >Register</Link>
          </NextLink>
        </Box>
      </Flex>
    );
}