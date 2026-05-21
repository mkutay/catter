import {
  type AnnotationHandler,
  type HighlightedCode,
  highlight,
  Inline,
  InnerLine,
  InnerPre,
  InnerToken,
  Pre,
  type RawCode,
} from "codehike/code";
import { fromPromise, fromThrowable } from "neverthrow";
import { CopyCodeButton } from "@/components/copy-code-button";
import { getValue, upsertKeyValue } from "@/lib/database-actions/key-values";
import { toMessage } from "@/lib/utils";
import { CatppuccinFrappe } from "./code-block-theme";

/**
 * Handler for CodeHike to wrap code that exceeds the width.
 */
export const wordWrap: AnnotationHandler = {
  name: "word-wrap",
  Pre: (props) => <InnerPre merge={props} className="whitespace-pre-wrap" />,
  Line: (props) => (
    <InnerLine merge={props}>
      <div
        style={{
          textIndent: `${-props.indentation}ch`,
          marginLeft: `${props.indentation}ch`,
        }}
      >
        {props.children}
      </div>
    </InnerLine>
  ),
  Token: (props) => <InnerToken merge={props} style={{ textIndent: 0 }} />,
};

/**
 * Handler for CodeHike to make code horizontally scrollable when it exceeds the width.
 */
export const scrollable: AnnotationHandler = {
  name: "scrollable",
  Pre: (props) => (
    <InnerPre merge={props} className="overflow-x-auto overflow-y-hidden" />
  ),
  Line: (props) => (
    <InnerLine merge={props}>
      <div
        style={{
          textIndent: `${-props.indentation}ch`,
          marginLeft: `${props.indentation}ch`,
          marginRight: `8px`,
        }}
      >
        {props.children}
      </div>
    </InnerLine>
  ),
  Token: (props) => <InnerToken merge={props} style={{ textIndent: 0 }} />,
};

/**
 * Handler for CodeHike to add line numbers.
 */
export const lineNumbers: AnnotationHandler = {
  name: "line-numbers",
  Line: (props) => {
    const width = props.totalLines.toString().length + 1;
    return (
      <div className="flex">
        <span
          className="text-right select-none text-[#626880]"
          style={{ minWidth: `${width}ch` }}
        >
          {props.lineNumber}
        </span>
        <InnerLine merge={props} className="flex-1 pl-2" />
      </div>
    );
  },
};

/**
 * Custom code block component that uses CodeHike for syntax highlighting and
 * supports copying code to clipboard.
 *
 * Should be used with MDX to render code blocks.
 */
export const MyCode = async ({ codeblock }: { codeblock: RawCode }) => {
  const highlighted = await getHighlight(codeblock);
  return (
    <div className="relative">
      <CopyCodeButton
        text={highlighted.code}
        className="absolute top-2 right-2"
      />
      <Pre
        code={highlighted}
        handlers={[scrollable, lineNumbers]}
        className="mt-6 px-1 py-2 text-sm rounded-lg font-mono bg-[#303446]"
      />
    </div>
  );
};

/**
 * Custom inline code component that uses CodeHike for syntax highlighting.
 *
 * Should be used with MDX to render inline code.
 */
export const MyInlineCode = async ({ codeblock }: { codeblock: RawCode }) => {
  const highlighted = await getHighlight(codeblock);
  return (
    <Inline
      code={highlighted}
      className="px-1 py-0.5 rounded-sm text-sm font-mono bg-[#303446]"
    />
  );
};

type CacheError = {
  code: "CACHE_ERROR";
  message: string;
};

const parseCachedValue = (value: string) =>
  fromThrowable(
    (): HighlightedCode => JSON.parse(value),
    (err): CacheError => ({
      code: "CACHE_ERROR",
      message: `Failed to parse placeholder cache value: ${toMessage(err)}`,
    }),
  )();

const getCache = (cacheKey: string) =>
  getValue(cacheKey).andThen(({ value }) => parseCachedValue(value));

const setCache = (cacheKey: string, code: RawCode) =>
  fromPromise(
    highlight(code, CatppuccinFrappe),
    (err): CacheError => ({
      code: "CACHE_ERROR",
      message: `Failed to highlight code for caching: ${toMessage(err)}`,
    }),
  ).andTee((highlighted) =>
    upsertKeyValue({
      key: cacheKey,
      value: JSON.stringify(highlighted),
    }),
  );

const getCacheKey = (code: RawCode) => JSON.stringify(code);

const getHighlight = async (code: RawCode): Promise<HighlightedCode> => {
  const cacheKey = getCacheKey(code);
  return await getCache(cacheKey)
    .orElse(() => setCache(cacheKey, code))
    .match(
      (val) => val,
      (err) => {
        throw new Error(err.message);
      },
    );
};
