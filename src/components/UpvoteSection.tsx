import React from "react";
import { Flex, IconButton } from "@chakra-ui/react";
import { BsChevronUp, BsChevronDown } from "react-icons/bs";
import { PostSnippetFragment, useVoteMutation } from "../generated/graphql";

interface UpvoteSectionProps {
  post: PostSnippetFragment
}

export const UpvoteSection: React.FC<UpvoteSectionProps> = ({ post }) => {
  const [, vote] = useVoteMutation();
  return (
    <Flex
      mr={4}
      direction="column"
      alignItems="center"
      justifyContent="space-around"
    >
      <IconButton
        aria-label="upvote"
        icon={<BsChevronUp />}
        size="xs"
        onClick={() => vote({ postId: post.id, value: 1 })}
      />
      {post.points}
      <IconButton
        aria-label="downvote"
        icon={<BsChevronDown />}
        size="xs"
        onClick={() => vote({ postId: post.id, value: -1 })}
      />
    </Flex>
  );
}