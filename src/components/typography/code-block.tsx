import { AnnotationHandler, highlight, HighlightedCode, Inline, InnerLine, InnerPre, InnerToken, Pre } from 'codehike/code';

import { CopyCodeButton } from '@/components/copy-button';
import { myTheme } from './code-block-theme';

// Handler for CodeHike to wrap code that exceeds the width.
export const wordWrap: AnnotationHandler = {
  name: 'word-wrap',
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
}

export const scrollable: AnnotationHandler = {
  name: 'scrollable',
  Pre: (props) => (
    <InnerPre
      merge={props}
      className="overflow-x-auto overflow-y-hidden"
    />
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
  Token: (props) => (
    <InnerToken
      merge={props}
      // className="overflow-x-auto overflow-y-hidden whitespace-nowrap"
      style={{ textIndent: 0 }}
    />
  ),
}

// Handler for CodeHike to add line numbers.
export const lineNumbers: AnnotationHandler = {
  name: 'line-numbers',
  Line: (props) => {
    const width = props.totalLines.toString().length + 1;
    return (
      <div className="flex">
        <span
          className="text-right select-none text-[#626880]"
          style={{ minWidth: `${width}ch`}}
        >
          {props.lineNumber}
        </span>
        <InnerLine merge={props} className="flex-1 pl-2" />
      </div>
    );
  },
}

export const MyCode = async ({ codeblock }: { codeblock: HighlightedCode }) => {
  const highlighted = await highlight(codeblock, myTheme);
  return <div className="relative">
    <CopyCodeButton text={highlighted.code} className="absolute top-2 right-2" />
    <Pre
      code={highlighted}
      handlers={[scrollable, lineNumbers]}
      className="mt-6 px-1 py-2 text-sm rounded-lg font-mono bg-[#303446]"
    />
  </div>;
};

export const MyInlineCode = async ({ codeblock }: { codeblock: HighlightedCode }) => {
  const highlighted = await highlight(codeblock, myTheme);
  return <Inline code={highlighted} className="px-1 py-0.5 rounded-sm text-sm font-mono bg-[#303446]" />
};