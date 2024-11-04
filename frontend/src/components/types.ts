// types.ts

export interface HeaderBlock {
    __component: "layout.header";
    id: number;
    Model: string;
    Theme: boolean;
  }
  
  export interface FooterBlock {
    __component: "layout.footer";
    id: number;
    Description: string;
  }
  
  export interface ChattingBlock {
    __component: "layout.chatting";
    id: number;
    question: string;
    answer: string;
  }
  
  export type PageBlock = HeaderBlock | FooterBlock | ChattingBlock;
  
  export interface ChatMessage {
    question: string;
    answer: string | JSX.Element;
  }
  