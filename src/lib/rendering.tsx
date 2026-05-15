import { errAsync, fromSafePromise, okAsync } from "neverthrow";
import { evaluate, MDXRemote } from "next-mdx-remote-client/rsc";
import { components, options, type Scope } from "@/config/mdx-settings";
import type { PostMeta } from "@/config/types";

/**
 * Renders a post from its source string.
 *
 * @param source The source string of the post.
 * @returns An async result containing the rendered content and scope,
 * or an error if rendering fails.
 *
 * @example
 * ```tsx
 * const result = await renderPost(source);
 * if (result.isOk()) {
 *   // Can be used to directly render the content in a React component.
 *   return <div>{result.value.content}</div>;
 * }
 * ```
 */
export const renderPost = (source: string) =>
  fromSafePromise(
    evaluate<PostMeta, Scope>({
      source,
      options,
      components,
    }),
  ).andThen(({ content, scope, error }) => {
    if (error)
      return errAsync({
        message: error.message,
        code: "RENDER_ERROR" as const,
      });
    else return okAsync({ content, scope });
  });

/**
 * Renders a post from its source string using the MDXRemote component.
 *
 * @param source The source string of the post.
 * @param naked Whether to render the post content without the default components/options.
 * @returns A React component that renders the post content.
 */
export const RenderPost = ({
  source,
  naked,
}: {
  source: string;
  naked?: boolean;
}) =>
  naked ? (
    <MDXRemote source={source} />
  ) : (
    <MDXRemote source={source} components={components} options={options} />
  );
