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
        colorScheme={post.voteStatus === 1 ? "green" : undefined}
        icon={<BsChevronUp />}
        size="xs"
        onClick={() => {
          if(post.voteStatus === 1) {
            return;
          }
          vote({ postId: post.id, value: 1 })
        }}
      />
      {post.points}
      <IconButton
        aria-label="downvote"
        colorScheme={post.voteStatus === -1 ? "red" : undefined}
        icon={<BsChevronDown />}
        size="xs"
        onClick={() => {
          if(post.voteStatus === -1) {
            return;
          }
          vote({ postId: post.id, value: -1 })
        }}
      />
    </Flex>
  );
}