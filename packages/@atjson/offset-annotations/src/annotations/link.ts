import { EdgeBehaviour, InlineAnnotation } from "@atjson/document";

export class Link extends InlineAnnotation<{
  url: string;
  title?: string;
  rel?: string;
  target?: string;
  isAffiliateLink?: boolean;
  linkStyle?: "button";
}> {
  static vendorPrefix = "offset";
  static type = "link";
  static edgeBehaviour = {
    leading: EdgeBehaviour.preserve,
    trailing: EdgeBehaviour.preserve,
  };
}
