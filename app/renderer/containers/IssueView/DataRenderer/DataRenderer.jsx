import React from 'react';
import ReactMarkdown from 'react-markdown';
import {
  shell,
} from 'electron';

import type {
  StatelessFunctionalComponent,
  Node,
} from 'react';

type Props = {
  html: string,
  source: string,
  onAttachmentClick: any,
};

const DataRenderer: StatelessFunctionalComponent<Props> = ({
  html,
  source,
  onAttachmentClick,
}: Props): Node => (html ? (
  <div
    onClick={onAttachmentClick}
    dangerouslySetInnerHTML={{
      __html: html,
    }}
  />
) : (
  <ReactMarkdown
    softBreak="br"
    linkTarget="_blank"
    source={source}
    renderers={{
      link: link => (
        <a
          href={link.href}
          onClick={(ev) => {
            ev.preventDefault();
            ev.stopPropagation();
            shell.openExternal(link.href);
          }}
        >
          {link.children}
        </a>
      ),
      linkReference: (link) => {
        let url = '';
        let text = '';
        try {
          const jiraLink = link.children[0].props.value.split('|');
          [text, url] = jiraLink;
          if (!url) {
            url = text;
          }
        } catch (err) {
          url = link.children;
          text = link.children;
        }
        return (
          <a
            href={link.href}
            onClick={(ev) => {
              ev.preventDefault();
              ev.stopPropagation();
              shell.openExternal(url);
            }}
          >
            {text}
          </a>
        );
      },
    }}
  />
));

export default DataRenderer;
