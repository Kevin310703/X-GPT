import type { Schema, Struct } from '@strapi/strapi';

export interface ComponentsLink extends Struct.ComponentSchema {
  collectionName: 'components_components_links';
  info: {
    displayName: 'Link';
  };
  attributes: {
    isExternal: Schema.Attribute.Boolean;
    url: Schema.Attribute.String;
  };
}

export interface LayoutChatting extends Struct.ComponentSchema {
  collectionName: 'components_layout_chattings';
  info: {
    description: '';
    displayName: 'Chatting';
  };
  attributes: {
    answer: Schema.Attribute.Text;
    avatar: Schema.Attribute.Media<'images', true>;
    avtChatbot: Schema.Attribute.Media<'images', true>;
    question: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 700;
      }>;
  };
}

export interface LayoutFooter extends Struct.ComponentSchema {
  collectionName: 'components_layout_footers';
  info: {
    displayName: 'Footer';
  };
  attributes: {
    Description: Schema.Attribute.String;
  };
}

export interface LayoutHeader extends Struct.ComponentSchema {
  collectionName: 'components_layout_headers';
  info: {
    description: '';
    displayName: 'header';
  };
  attributes: {
    Avatar: Schema.Attribute.Media<'images'>;
    Model: Schema.Attribute.Enumeration<['T5', 'Stable Diffusion']>;
    Theme: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'components.link': ComponentsLink;
      'layout.chatting': LayoutChatting;
      'layout.footer': LayoutFooter;
      'layout.header': LayoutHeader;
    }
  }
}
