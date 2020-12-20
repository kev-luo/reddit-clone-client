import React from "react";
import { Flex, IconButton } from "@chakra-ui/react";
import { BsChevronUp, BsChevronDown } from "react-icons/bs";
import { PostSnippetFragment } from "../generated/graphql";

interface UpvoteSectionProps {
  post: PostSnippetFragment
}

export const UpvoteSection: React.FC<UpvoteSectionProps> = ({ post }) => {
  return (
    <Flex mr={4} direction="column" alignItems="center" justifyContent="space-around">
      <IconButton aria-label="upvote" icon={<BsChevronUp />} size="xs" />
      {post.points}
      <IconButton aria-label="downvote" icon={<BsChevronDown />} size="xs" />
    </Flex>
  );
}