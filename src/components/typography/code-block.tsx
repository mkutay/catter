import { AnnotationHandler, highlight, Inline, InnerLine, InnerPre, InnerToken, Pre, RawCode } from 'codehike/code';

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

// Handler for CodeHike to add line numbers.
export const lineNumbers: AnnotationHandler = {
  name: 'line-numbers',
  Line: (props) => {
    const width = props.totalLines.toString().length + 1;
    return (
      <div className="flex">
        <span
          className="text-right select-none"
          style={{ minWidth: `${width}ch` }}
        >
          {props.lineNumber}
        </span>
        <InnerLine merge={props} className="flex-1 pl-2" />
      </div>
    );
  },
}

export const MyCode = async ({ codeblock }: { codeblock: RawCode }) => {
  const highlighted = await highlight(codeblock, 'github-dark');
  return <Pre code={highlighted} handlers={[wordWrap, lineNumbers]} className="mt-6 px-1 py-3 rounded-lg bg-[#0d1117]" />
};

export const MyInlineCode = async ({ codeblock }: { codeblock: RawCode }) => {
  const highlighted = await highlight(codeblock, 'github-dark');
  return <Inline code={highlighted} style={highlighted.style} className="px-1 py-0.5 rounded-sm" />
};