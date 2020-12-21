import { Flex, IconButton } from "@chakra-ui/react";
import React from "react";
import { BsPencilSquare, BsTrash2 } from "react-icons/bs";
import NextLink from "next/link";
import { useDeletePostMutation } from "../generated/graphql";

interface EditDeletePostBtnsProps {
  id: number
}

export const EditDeletePostBtns: React.FC<EditDeletePostBtnsProps> = ({ id }) => {
  const [, deletePost] = useDeletePostMutation();
  return (
    <Flex alignSelf="center">
      <NextLink href="/post/edit/[id]" as={`/post/edit/${id}`}>
        <IconButton aria-label="edit post" icon={<BsPencilSquare />} size="sm" mr={2} />
      </NextLink>
      <IconButton
        aria-label="delete post"
        icon={<BsTrash2 />}
        size="sm"
        onClick={() => deletePost({ id })}
      />
    </Flex>
  );
}