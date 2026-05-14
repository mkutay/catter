import {
  type AnnotationHandler,
  highlight,
  Inline,
  InnerLine,
  InnerPre,
  InnerToken,
  Pre,
  type RawCode,
} from "codehike/code";
import { CopyCodeButton } from "@/components/copy-code-button";
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
  const highlighted = await highlight(codeblock, CatppuccinFrappe);
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
  const highlighted = await highlight(codeblock, CatppuccinFrappe);
  return (
    <Inline
      code={highlighted}
      className="px-1 py-0.5 rounded-sm text-sm font-mono bg-[#303446]"
    />
  );
};
