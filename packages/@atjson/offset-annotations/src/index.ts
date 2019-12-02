import Document from "@atjson/document";
import {
  Blockquote,
  Bold,
  CerosEmbed,
  Code,
  FacebookEmbed,
  FixedIndent,
  GiphyEmbed,
  HTML,
  Heading,
  HorizontalRule,
  IframeEmbed,
  Image,
  InstagramEmbed,
  Italic,
  LineBreak,
  Link,
  List,
  ListItem,
  Paragraph,
  PinterestEmbed,
  Pullquote,
  Section,
  SmallCaps,
  Strikethrough,
  Subscript,
  Superscript,
  TwitterEmbed,
  Underline,
  YouTubeEmbed
} from "./annotations";

export * from "./annotations";
export * from "./utils";

export default class OffsetSource extends Document {
  static contentType = "application/vnd.atjson+offset";
  static schema = [
    Blockquote,
    Bold,
    CerosEmbed,
    Code,
    FacebookEmbed,
    FixedIndent,
    GiphyEmbed,
    Heading,
    HorizontalRule,
    HTML,
    IframeEmbed,
    Image,
    InstagramEmbed,
    Italic,
    LineBreak,
    Link,
    List,
    ListItem,
    Paragraph,
    PinterestEmbed,
    Pullquote,
    Section,
    SmallCaps,
    Strikethrough,
    Subscript,
    Superscript,
    TwitterEmbed,
    Underline,
    YouTubeEmbed
  ];
}
