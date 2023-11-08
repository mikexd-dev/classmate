import React from "react";
import Markdown from "react-markdown";
// import remarkDirective from "remark-directive";
// import rehypeHighlight from "rehype-highlight";
import { visit } from "unist-util-visit";

import "highlight.js/styles/github.css";
import remarkBreaks from "remark-breaks";
import { hashMessage } from "ethers";

function customNotesPlugin() {
  return function transformer(tree: any) {
    const visitor: any = (node: any) => {
      if (node.name !== "iframe") return;
      const data = node.data || (node.data = {});
      data.hName = "iframe";
      data.hProperties = {
        ...node.attributes,
        // title: node.attributes.title ?? "Note",
        // data: node.attributes.data ?? "Data",
        // height: node.attributes.height ?? "auto",
        // width: node.attributes.width ?? "auto"
      };
    };

    visit(tree, ["containerDirective"], visitor);
  };
}
const MarkdownMemo = ({
  markdown,
  messageId,
  chatId,
  messageRole,
  message,
  isRendering,
}: any) => {
  const ReactMarkdownMemo = React.useMemo(() => {
    const headerParser = ({ node, className, children, ...props }: any) => {
      if (children === undefined) {
        console.log("returnm empty block");
        return <></>;
      }
      console.log(node);
      let text = children[0]?.props?.children[0];
      let href = children[0]?.props?.href;
      let id = href === "#" ? href.slice(1) : href;
      return (
        <node.tagName {...props} {...{ className }} id={id}>
          <a href={href}>{text}</a>
        </node.tagName>
      );
    };
    const ComponentConstructor = () => (
      <div>
        <Markdown
          className={"overflow-y-auto max-w-[250px] overflow-x-hidden"}
          children={markdown.replace(/\n/gi, "&nbsp; \n")}
          remarkPlugins={[customNotesPlugin, remarkBreaks]}
          // rehypePlugins={[rehypeHighlight]}
          components={{
            h1: headerParser,
            h2: headerParser,
            h3: headerParser,
            h4: headerParser,
            h5: headerParser,
            h6: headerParser,
            img({ node, className, children, ...props }) {
              const { src, alt, ...other } = props;
              return <img src={src} alt={alt} {...other} {...{ className }} />;
            },
            iframe({ node, className, children, ...props }) {
              return (
                <iframe title="unique" {...props}>
                  {children}
                </iframe>
              );
            },
          }}
        />
      </div>
    );
    return ComponentConstructor;
  }, [markdown]);
  return <ReactMarkdownMemo />;
};

const MarkdownComponent = React.memo(MarkdownMemo);

export { MarkdownComponent };
