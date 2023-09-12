import { serialize } from "@atjson/document";
import OffsetSource, { VideoURLs } from "@atjson/offset-annotations";
import HTMLSource from "../src";

describe("@atjson/source-html", () => {
  describe("converter", () => {
    test("bold, strong", () => {
      let doc = HTMLSource.fromRaw(
        "This <b>text</b> is <strong>bold</strong>"
      ).convertTo(OffsetSource);
      expect(serialize(doc)).toMatchObject({
        text: "\uFFFCThis text is bold",
        blocks: [{ type: "text" }],
        marks: [
          {
            type: "bold",
            range: "(6..10]",
          },
          {
            type: "bold",
            range: "(14..18]",
          },
        ],
      });
    });

    test("i, em", () => {
      let doc = HTMLSource.fromRaw(
        "This <i>text</i> is <em>italic</em>"
      ).convertTo(OffsetSource);
      expect(serialize(doc)).toMatchObject({
        text: "\uFFFCThis text is italic",
        blocks: [{ type: "text" }],
        marks: [
          {
            type: "italic",
            range: "(6..10]",
          },
          {
            type: "italic",
            range: "(14..20]",
          },
        ],
      });
    });

    test("s, del", () => {
      let doc = HTMLSource.fromRaw(
        "This is some <del>deleted</del> and <s>struck</s> text"
      ).convertTo(OffsetSource);
      expect(serialize(doc)).toMatchObject({
        text: "\uFFFCThis is some deleted and struck text",
        blocks: [{ type: "text" }],
        marks: [
          {
            type: "strikethrough",
            range: "(14..21]",
          },
          {
            type: "strikethrough",
            range: "(26..32]",
          },
        ],
      });
    });

    test("h1, h2, h3, h4, h5, h6", () => {
      let doc = HTMLSource.fromRaw(
        "<h1>Title</h1><h2>Byline</h2><h3>Section</h3><h4>Normal heading</h4><h5>Small heading</h5><h6>Tiny heading</h6>"
      ).convertTo(OffsetSource);
      expect(serialize(doc, { withStableIds: true })).toMatchInlineSnapshot(`
        {
          "blocks": [
            {
              "attributes": {
                "level": 1,
              },
              "id": "B00000000",
              "parents": [],
              "selfClosing": false,
              "type": "heading",
            },
            {
              "attributes": {
                "level": 2,
              },
              "id": "B00000001",
              "parents": [],
              "selfClosing": false,
              "type": "heading",
            },
            {
              "attributes": {
                "level": 3,
              },
              "id": "B00000002",
              "parents": [],
              "selfClosing": false,
              "type": "heading",
            },
            {
              "attributes": {
                "level": 4,
              },
              "id": "B00000003",
              "parents": [],
              "selfClosing": false,
              "type": "heading",
            },
            {
              "attributes": {
                "level": 5,
              },
              "id": "B00000004",
              "parents": [],
              "selfClosing": false,
              "type": "heading",
            },
            {
              "attributes": {
                "level": 6,
              },
              "id": "B00000005",
              "parents": [],
              "selfClosing": false,
              "type": "heading",
            },
          ],
          "marks": [],
          "text": "￼Title￼Byline￼Section￼Normal heading￼Small heading￼Tiny heading",
        }
      `);
    });

    test("p, br", () => {
      let doc = HTMLSource.fromRaw(
        "<p>This paragraph has a<br>line break</p>"
      ).convertTo(OffsetSource);
      expect(serialize(doc, { withStableIds: true })).toMatchInlineSnapshot(`
        {
          "blocks": [
            {
              "attributes": {},
              "id": "B00000000",
              "parents": [],
              "selfClosing": false,
              "type": "paragraph",
            },
            {
              "attributes": {},
              "id": "B00000001",
              "parents": [
                "paragraph",
              ],
              "selfClosing": true,
              "type": "line-break",
            },
          ],
          "marks": [],
          "text": "￼This paragraph has a￼line break",
        }
      `);
    });

    test("a", () => {
      let doc = HTMLSource.fromRaw(
        'This <a href="https://condenast.com" rel="nofollow" target="_blank" title="Condé Nast">is a link</a>'
      ).convertTo(OffsetSource);
      expect(serialize(doc, { withStableIds: true })).toMatchInlineSnapshot(`
        {
          "blocks": [
            {
              "attributes": {},
              "id": "B00000000",
              "parents": [],
              "selfClosing": false,
              "type": "text",
            },
          ],
          "marks": [
            {
              "attributes": {
                "rel": "nofollow",
                "target": "_blank",
                "title": "Condé Nast",
                "url": "https://condenast.com",
              },
              "id": "M00000000",
              "range": "(6..15)",
              "type": "link",
            },
          ],
          "text": "￼This is a link",
        }
      `);
    });

    test("hr", () => {
      let doc = HTMLSource.fromRaw(
        "<p>Horizontal</p><hr><p>rules!</p>"
      ).convertTo(OffsetSource);
      expect(serialize(doc, { withStableIds: true })).toMatchInlineSnapshot(`
        {
          "blocks": [
            {
              "attributes": {},
              "id": "B00000000",
              "parents": [],
              "selfClosing": false,
              "type": "paragraph",
            },
            {
              "attributes": {},
              "id": "B00000001",
              "parents": [],
              "selfClosing": false,
              "type": "horizontal-rule",
            },
            {
              "attributes": {},
              "id": "B00000002",
              "parents": [],
              "selfClosing": false,
              "type": "paragraph",
            },
          ],
          "marks": [],
          "text": "￼Horizontal￼￼rules!",
        }
      `);
    });

    test("img", () => {
      let doc = HTMLSource.fromRaw(
        '<img src="https://pbs.twimg.com/media/DXiMcM9X4AEhR3u.jpg" alt="Miles Davis came out, blond, in gold lamé, and he plays really terrific music. High heels. 4/6/86" title="Miles Davis & Andy Warhol">'
      ).convertTo(OffsetSource);
      expect(serialize(doc, { withStableIds: true })).toMatchInlineSnapshot(`
        {
          "blocks": [
            {
              "attributes": {
                "description": "Miles Davis came out, blond, in gold lamé, and he plays really terrific music. High heels. 4/6/86",
                "title": "Miles Davis & Andy Warhol",
                "url": "https://pbs.twimg.com/media/DXiMcM9X4AEhR3u.jpg",
              },
              "id": "B00000000",
              "parents": [],
              "selfClosing": true,
              "type": "image",
            },
          ],
          "marks": [],
          "text": "￼",
        }
      `);
    });

    test("code", () => {
      let doc = HTMLSource.fromRaw(
        `<code>console.log('wowowowow');</code>`
      ).convertTo(OffsetSource);
      expect(serialize(doc, { withStableIds: true })).toMatchInlineSnapshot(`
        {
          "blocks": [
            {
              "attributes": {},
              "id": "B00000000",
              "parents": [],
              "selfClosing": false,
              "type": "text",
            },
          ],
          "marks": [
            {
              "attributes": {},
              "id": "M00000000",
              "range": "(1..26]",
              "type": "code",
            },
          ],
          "text": "￼console.log('wowowowow');",
        }
      `);
    });

    describe("code blocks", () => {
      test("pre code", () => {
        let doc = HTMLSource.fromRaw(
          `<pre> <code>console.log('wowowowow');</code>\n</pre>`
        ).convertTo(OffsetSource);
        expect(serialize(doc, { withStableIds: true })).toMatchInlineSnapshot(`
          {
            "blocks": [
              {
                "attributes": {},
                "id": "B00000000",
                "parents": [],
                "selfClosing": false,
                "type": "text",
              },
              {
                "attributes": {},
                "id": "B00000001",
                "parents": [],
                "selfClosing": false,
                "type": "code-block",
              },
              {
                "attributes": {},
                "id": "B00000002",
                "parents": [],
                "selfClosing": false,
                "type": "text",
              },
            ],
            "marks": [],
            "text": "￼ ￼console.log('wowowowow');￼
          ",
          }
        `);
      });

      test("multiple code blocks inside of pre", () => {
        let doc = HTMLSource.fromRaw(
          `<pre><code>console.log('wow');</code><code>console.log('wowowow');</code></pre>`
        ).convertTo(OffsetSource);
        doc.where((a) => a.type === "unknown").remove();

        expect(serialize(doc, { withStableIds: true })).toMatchInlineSnapshot(`
          {
            "blocks": [
              {
                "attributes": {},
                "id": "B00000000",
                "parents": [],
                "selfClosing": false,
                "type": "text",
              },
            ],
            "marks": [
              {
                "attributes": {},
                "id": "M00000000",
                "range": "(1..20]",
                "type": "code",
              },
              {
                "attributes": {},
                "id": "M00000001",
                "range": "(20..43]",
                "type": "code",
              },
            ],
            "text": "￼console.log('wow');console.log('wowowow');",
          }
        `);
      });

      test("text inside of pre, but not code", () => {
        let doc = HTMLSource.fromRaw(
          `<pre>hi<code>console.log('wowowow');</code></pre>`
        ).convertTo(OffsetSource);
        doc.where((a) => a.type === "unknown").remove();

        expect(serialize(doc, { withStableIds: true })).toMatchInlineSnapshot(`
          {
            "blocks": [
              {
                "attributes": {},
                "id": "B00000000",
                "parents": [],
                "selfClosing": false,
                "type": "text",
              },
            ],
            "marks": [
              {
                "attributes": {},
                "id": "M00000000",
                "range": "(3..26]",
                "type": "code",
              },
            ],
            "text": "￼hiconsole.log('wowowow');",
          }
        `);
      });
    });

    test("ul, ol, li", () => {
      let doc = HTMLSource.fromRaw(
        '<ol start="2"><li>Second</li><li>Third</li></ol><ul><li>First</li><li>Second</li></ul>'
      ).convertTo(OffsetSource);
      expect(serialize(doc, { withStableIds: true })).toMatchInlineSnapshot(`
        {
          "blocks": [
            {
              "attributes": {
                "startsAt": 2,
                "type": "numbered",
              },
              "id": "B00000000",
              "parents": [],
              "selfClosing": false,
              "type": "list",
            },
            {
              "attributes": {},
              "id": "B00000001",
              "parents": [
                "list",
              ],
              "selfClosing": false,
              "type": "list-item",
            },
            {
              "attributes": {},
              "id": "B00000002",
              "parents": [
                "list",
              ],
              "selfClosing": false,
              "type": "list-item",
            },
            {
              "attributes": {
                "type": "bulleted",
              },
              "id": "B00000003",
              "parents": [],
              "selfClosing": false,
              "type": "list",
            },
            {
              "attributes": {},
              "id": "B00000004",
              "parents": [
                "list",
              ],
              "selfClosing": false,
              "type": "list-item",
            },
            {
              "attributes": {},
              "id": "B00000005",
              "parents": [
                "list",
              ],
              "selfClosing": false,
              "type": "list-item",
            },
          ],
          "marks": [],
          "text": "￼￼Second￼Third￼￼First￼Second",
        }
      `);
    });

    test("section", () => {
      let doc = HTMLSource.fromRaw(
        `<section><p>Paragraph in a section.</p></section>`
      ).convertTo(OffsetSource);

      expect(serialize(doc, { withStableIds: true })).toMatchInlineSnapshot(`
        {
          "blocks": [
            {
              "attributes": {},
              "id": "B00000000",
              "parents": [],
              "selfClosing": false,
              "type": "section",
            },
            {
              "attributes": {},
              "id": "B00000001",
              "parents": [
                "section",
              ],
              "selfClosing": false,
              "type": "paragraph",
            },
          ],
          "marks": [],
          "text": "￼￼Paragraph in a section.",
        }
      `);
    });

    test("smallcaps", () => {
      let doc = HTMLSource.fromRaw(
        `<p><span class="smallcaps">SmallCaps</span> in a paragraph.</p>`
      ).convertTo(OffsetSource);

      expect(serialize(doc, { withStableIds: true })).toMatchInlineSnapshot(`
        {
          "blocks": [
            {
              "attributes": {},
              "id": "B00000000",
              "parents": [],
              "selfClosing": false,
              "type": "paragraph",
            },
          ],
          "marks": [
            {
              "attributes": {
                "-html-class": "smallcaps",
              },
              "id": "M00000000",
              "range": "(1..10]",
              "type": "small-caps",
            },
          ],
          "text": "￼SmallCaps in a paragraph.",
        }
      `);
    });

    test("protocol-relative iframe embeds", () => {
      let doc = HTMLSource.fromRaw(
        `<iframe src="//example.com"
            scrolling="no" frameborder="0"
            allowTransparency="true" allow="encrypted-media"></iframe>`
      ).convertTo(OffsetSource);

      expect(serialize(doc, { withStableIds: true })).toMatchInlineSnapshot(`
        {
          "blocks": [
            {
              "attributes": {
                "url": "//example.com",
              },
              "id": "B00000000",
              "parents": [],
              "selfClosing": false,
              "type": "iframe-embed",
            },
          ],
          "marks": [],
          "text": "￼",
        }
      `);
    });

    describe("social embeds", () => {
      test("Facebook iframe embed", () => {
        let doc = HTMLSource.fromRaw(
          `<iframe src="https://www.facebook.com/plugins/post.php?href=https%3A%2F%2Fwww.facebook.com%2FBeethovenOfficialPage%2Fposts%2F2923157684380743&width=500"
            width="500" height="633"
            style="border:none;overflow:hidden"
            scrolling="no" frameborder="0"
            allowTransparency="true" allow="encrypted-media"></iframe>`
        ).convertTo(OffsetSource);

        expect(serialize(doc, { withStableIds: true })).toMatchInlineSnapshot(`
          {
            "blocks": [
              {
                "attributes": {
                  "height": "633",
                  "url": "https://www.facebook.com/BeethovenOfficialPage/posts/2923157684380743",
                  "width": "500",
                },
                "id": "B00000000",
                "parents": [],
                "selfClosing": false,
                "type": "facebook-embed",
              },
            ],
            "marks": [],
            "text": "￼",
          }
        `);
      });

      test("Facebook div embed", () => {
        let doc = HTMLSource.fromRaw(
          `<div class="fb-post" data-href="https://www.facebook.com/BeethovenOfficialPage/posts/2923157684380743" data-width="500" data-show-text="true"><blockquote cite="https://developers.facebook.com/BeethovenOfficialPage/posts/2923157684380743" class="fb-xfbml-parse-ignore"><p>Next stop of the exhibition &quot;BTHVN on Tour&quot; is in Boston!</p>Posted by <a href="https://www.facebook.com/BeethovenOfficialPage/">Ludwig van Beethoven</a> on&nbsp;<a href="https://developers.facebook.com/BeethovenOfficialPage/posts/2923157684380743">Thursday, October 24, 2019</a></blockquote></div>`
        ).convertTo(OffsetSource);

        expect(serialize(doc, { withStableIds: true })).toMatchInlineSnapshot(`
          {
            "blocks": [
              {
                "attributes": {
                  "url": "https://www.facebook.com/BeethovenOfficialPage/posts/2923157684380743",
                },
                "id": "B00000000",
                "parents": [],
                "selfClosing": false,
                "type": "facebook-embed",
              },
            ],
            "marks": [],
            "text": "￼",
          }
        `);
      });

      test("Instagram blockquote embed", () => {
        let doc = HTMLSource.fromRaw(
          `<blockquote class="instagram-media" data-instgrm-permalink="https://www.instagram.com/p/B37oY9WgHP7/?utm_source=ig_embed&amp;utm_campaign=loading" data-instgrm-version="12" style=" background:#FFF; border:0; border-radius:3px; box-shadow:0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15); margin: 1px; max-width:540px; min-width:326px; padding:0; width:99.375%; width:-webkit-calc(100% - 2px); width:calc(100% - 2px);"><div style="padding:16px;"> <a href="https://www.instagram.com/p/B37oY9WgHP7/?utm_source=ig_embed&amp;utm_campaign=loading" style=" background:#FFFFFF; line-height:0; padding:0 0; text-align:center; text-decoration:none; width:100%;" target="_blank"> <div style=" display: flex; flex-direction: row; align-items: center;"> <div style="background-color: #F4F4F4; border-radius: 50%; flex-grow: 0; height: 40px; margin-right: 14px; width: 40px;"></div> <div style="display: flex; flex-direction: column; flex-grow: 1; justify-content: center;"> <div style=" background-color: #F4F4F4; border-radius: 4px; flex-grow: 0; height: 14px; margin-bottom: 6px; width: 100px;"></div> <div style=" background-color: #F4F4F4; border-radius: 4px; flex-grow: 0; height: 14px; width: 60px;"></div></div></div><div style="padding: 19% 0;"></div> <div style="display:block; height:50px; margin:0 auto 12px; width:50px;"><svg width="50px" height="50px" viewBox="0 0 60 60" version="1.1" xmlns="https://www.w3.org/2000/svg" xmlns:xlink="https://www.w3.org/1999/xlink"><g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g transform="translate(-511.000000, -20.000000)" fill="#000000"><g><path d="M556.869,30.41 C554.814,30.41 553.148,32.076 553.148,34.131 C553.148,36.186 554.814,37.852 556.869,37.852 C558.924,37.852 560.59,36.186 560.59,34.131 C560.59,32.076 558.924,30.41 556.869,30.41 M541,60.657 C535.114,60.657 530.342,55.887 530.342,50 C530.342,44.114 535.114,39.342 541,39.342 C546.887,39.342 551.658,44.114 551.658,50 C551.658,55.887 546.887,60.657 541,60.657 M541,33.886 C532.1,33.886 524.886,41.1 524.886,50 C524.886,58.899 532.1,66.113 541,66.113 C549.9,66.113 557.115,58.899 557.115,50 C557.115,41.1 549.9,33.886 541,33.886 M565.378,62.101 C565.244,65.022 564.756,66.606 564.346,67.663 C563.803,69.06 563.154,70.057 562.106,71.106 C561.058,72.155 560.06,72.803 558.662,73.347 C557.607,73.757 556.021,74.244 553.102,74.378 C549.944,74.521 548.997,74.552 541,74.552 C533.003,74.552 532.056,74.521 528.898,74.378 C525.979,74.244 524.393,73.757 523.338,73.347 C521.94,72.803 520.942,72.155 519.894,71.106 C518.846,70.057 518.197,69.06 517.654,67.663 C517.244,66.606 516.755,65.022 516.623,62.101 C516.479,58.943 516.448,57.996 516.448,50 C516.448,42.003 516.479,41.056 516.623,37.899 C516.755,34.978 517.244,33.391 517.654,32.338 C518.197,30.938 518.846,29.942 519.894,28.894 C520.942,27.846 521.94,27.196 523.338,26.654 C524.393,26.244 525.979,25.756 528.898,25.623 C532.057,25.479 533.004,25.448 541,25.448 C548.997,25.448 549.943,25.479 553.102,25.623 C556.021,25.756 557.607,26.244 558.662,26.654 C560.06,27.196 561.058,27.846 562.106,28.894 C563.154,29.942 563.803,30.938 564.346,32.338 C564.756,33.391 565.244,34.978 565.378,37.899 C565.522,41.056 565.552,42.003 565.552,50 C565.552,57.996 565.522,58.943 565.378,62.101 M570.82,37.631 C570.674,34.438 570.167,32.258 569.425,30.349 C568.659,28.377 567.633,26.702 565.965,25.035 C564.297,23.368 562.623,22.342 560.652,21.575 C558.743,20.834 556.562,20.326 553.369,20.18 C550.169,20.033 549.148,20 541,20 C532.853,20 531.831,20.033 528.631,20.18 C525.438,20.326 523.257,20.834 521.349,21.575 C519.376,22.342 517.703,23.368 516.035,25.035 C514.368,26.702 513.342,28.377 512.574,30.349 C511.834,32.258 511.326,34.438 511.181,37.631 C511.035,40.831 511,41.851 511,50 C511,58.147 511.035,59.17 511.181,62.369 C511.326,65.562 511.834,67.743 512.574,69.651 C513.342,71.625 514.368,73.296 516.035,74.965 C517.703,76.634 519.376,77.658 521.349,78.425 C523.257,79.167 525.438,79.673 528.631,79.82 C531.831,79.965 532.853,80.001 541,80.001 C549.148,80.001 550.169,79.965 553.369,79.82 C556.562,79.673 558.743,79.167 560.652,78.425 C562.623,77.658 564.297,76.634 565.965,74.965 C567.633,73.296 568.659,71.625 569.425,69.651 C570.167,67.743 570.674,65.562 570.82,62.369 C570.966,59.17 571,58.147 571,50 C571,41.851 570.966,40.831 570.82,37.631"></path></g></g></g></svg></div><div style="padding-top: 8px;"> <div style=" color:#3897f0; font-family:Arial,sans-serif; font-size:14px; font-style:normal; font-weight:550; line-height:18px;"> View this post on Instagram</div></div><div style="padding: 12.5% 0;"></div> <div style="display: flex; flex-direction: row; margin-bottom: 14px; align-items: center;"><div> <div style="background-color: #F4F4F4; border-radius: 50%; height: 12.5px; width: 12.5px; transform: translateX(0px) translateY(7px);"></div> <div style="background-color: #F4F4F4; height: 12.5px; transform: rotate(-45deg) translateX(3px) translateY(1px); width: 12.5px; flex-grow: 0; margin-right: 14px; margin-left: 2px;"></div> <div style="background-color: #F4F4F4; border-radius: 50%; height: 12.5px; width: 12.5px; transform: translateX(9px) translateY(-18px);"></div></div><div style="margin-left: 8px;"> <div style=" background-color: #F4F4F4; border-radius: 50%; flex-grow: 0; height: 20px; width: 20px;"></div> <div style=" width: 0; height: 0; border-top: 2px solid transparent; border-left: 6px solid #f4f4f4; border-bottom: 2px solid transparent; transform: translateX(16px) translateY(-4px) rotate(30deg)"></div></div><div style="margin-left: auto;"> <div style=" width: 0px; border-top: 8px solid #F4F4F4; border-right: 8px solid transparent; transform: translateY(16px);"></div> <div style=" background-color: #F4F4F4; flex-grow: 0; height: 12px; width: 16px; transform: translateY(-4px);"></div> <div style=" width: 0; height: 0; border-top: 8px solid #F4F4F4; border-left: 8px solid transparent; transform: translateY(-4px) translateX(8px);"></div></div></div> <div style="display: flex; flex-direction: column; flex-grow: 1; justify-content: center; margin-bottom: 24px;"> <div style=" background-color: #F4F4F4; border-radius: 4px; flex-grow: 0; height: 14px; margin-bottom: 6px; width: 224px;"></div> <div style=" background-color: #F4F4F4; border-radius: 4px; flex-grow: 0; height: 14px; width: 144px;"></div></div></a><p style=" color:#c9c8cd; font-family:Arial,sans-serif; font-size:14px; line-height:17px; margin-bottom:0; margin-top:8px; overflow:hidden; padding:8px 0 7px; text-align:center; text-overflow:ellipsis; white-space:nowrap;"><a href="https://www.instagram.com/p/B37oY9WgHP7/?utm_source=ig_embed&amp;utm_campaign=loading" style=" color:#c9c8cd; font-family:Arial,sans-serif; font-size:14px; font-style:normal; font-weight:normal; line-height:17px; text-decoration:none;" target="_blank">A post shared by WTF Bach (@wtfbach)</a> on <time style=" font-family:Arial,sans-serif; font-size:14px; line-height:17px;" datetime="2019-10-22T19:12:41+00:00">Oct 22, 2019 at 12:12pm PDT</time></p></div></blockquote> <script async src="//www.instagram.com/embed.js"></script>`
        ).convertTo(OffsetSource);

        expect(serialize(doc, { withStableIds: true })).toMatchInlineSnapshot(`
          {
            "blocks": [
              {
                "attributes": {
                  "url": "https://www.instagram.com/p/B37oY9WgHP7",
                },
                "id": "B00000000",
                "parents": [],
                "selfClosing": false,
                "type": "instagram-embed",
              },
            ],
            "marks": [],
            "text": "￼",
          }
        `);
      });

      test("Instagram TV blockquote embed", () => {
        let doc = HTMLSource.fromRaw(
          `<blockquote class="instagram-media" data-instgrm-captioned data-instgrm-permalink="https://www.instagram.com/tv/B95M4kNhbzz/?utm_source=ig_embed&amp;utm_campaign=loading" data-instgrm-version="12" style=" background:#FFF; border:0; border-radius:3px; box-shadow:0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15); margin: 1px; max-width:540px; min-width:326px; padding:0; width:99.375%; width:-webkit-calc(100% - 2px); width:calc(100% - 2px);"><div style="padding:16px;"> <a href="https://www.instagram.com/tv/B95M4kNhbzz/?utm_source=ig_embed&amp;utm_campaign=loading" style=" background:#FFFFFF; line-height:0; padding:0 0; text-align:center; text-decoration:none; width:100%;" target="_blank"> <div style=" display: flex; flex-direction: row; align-items: center;"> <div style="background-color: #F4F4F4; border-radius: 50%; flex-grow: 0; height: 40px; margin-right: 14px; width: 40px;"></div> <div style="display: flex; flex-direction: column; flex-grow: 1; justify-content: center;"> <div style=" background-color: #F4F4F4; border-radius: 4px; flex-grow: 0; height: 14px; margin-bottom: 6px; width: 100px;"></div> <div style=" background-color: #F4F4F4; border-radius: 4px; flex-grow: 0; height: 14px; width: 60px;"></div></div></div><div style="padding: 19% 0;"></div> <div style="display:block; height:50px; margin:0 auto 12px; width:50px;"><svg width="50px" height="50px" viewBox="0 0 60 60" version="1.1" xmlns="https://www.w3.org/2000/svg" xmlns:xlink="https://www.w3.org/1999/xlink"><g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g transform="translate(-511.000000, -20.000000)" fill="#000000"><g><path d="M556.869,30.41 C554.814,30.41 553.148,32.076 553.148,34.131 C553.148,36.186 554.814,37.852 556.869,37.852 C558.924,37.852 560.59,36.186 560.59,34.131 C560.59,32.076 558.924,30.41 556.869,30.41 M541,60.657 C535.114,60.657 530.342,55.887 530.342,50 C530.342,44.114 535.114,39.342 541,39.342 C546.887,39.342 551.658,44.114 551.658,50 C551.658,55.887 546.887,60.657 541,60.657 M541,33.886 C532.1,33.886 524.886,41.1 524.886,50 C524.886,58.899 532.1,66.113 541,66.113 C549.9,66.113 557.115,58.899 557.115,50 C557.115,41.1 549.9,33.886 541,33.886 M565.378,62.101 C565.244,65.022 564.756,66.606 564.346,67.663 C563.803,69.06 563.154,70.057 562.106,71.106 C561.058,72.155 560.06,72.803 558.662,73.347 C557.607,73.757 556.021,74.244 553.102,74.378 C549.944,74.521 548.997,74.552 541,74.552 C533.003,74.552 532.056,74.521 528.898,74.378 C525.979,74.244 524.393,73.757 523.338,73.347 C521.94,72.803 520.942,72.155 519.894,71.106 C518.846,70.057 518.197,69.06 517.654,67.663 C517.244,66.606 516.755,65.022 516.623,62.101 C516.479,58.943 516.448,57.996 516.448,50 C516.448,42.003 516.479,41.056 516.623,37.899 C516.755,34.978 517.244,33.391 517.654,32.338 C518.197,30.938 518.846,29.942 519.894,28.894 C520.942,27.846 521.94,27.196 523.338,26.654 C524.393,26.244 525.979,25.756 528.898,25.623 C532.057,25.479 533.004,25.448 541,25.448 C548.997,25.448 549.943,25.479 553.102,25.623 C556.021,25.756 557.607,26.244 558.662,26.654 C560.06,27.196 561.058,27.846 562.106,28.894 C563.154,29.942 563.803,30.938 564.346,32.338 C564.756,33.391 565.244,34.978 565.378,37.899 C565.522,41.056 565.552,42.003 565.552,50 C565.552,57.996 565.522,58.943 565.378,62.101 M570.82,37.631 C570.674,34.438 570.167,32.258 569.425,30.349 C568.659,28.377 567.633,26.702 565.965,25.035 C564.297,23.368 562.623,22.342 560.652,21.575 C558.743,20.834 556.562,20.326 553.369,20.18 C550.169,20.033 549.148,20 541,20 C532.853,20 531.831,20.033 528.631,20.18 C525.438,20.326 523.257,20.834 521.349,21.575 C519.376,22.342 517.703,23.368 516.035,25.035 C514.368,26.702 513.342,28.377 512.574,30.349 C511.834,32.258 511.326,34.438 511.181,37.631 C511.035,40.831 511,41.851 511,50 C511,58.147 511.035,59.17 511.181,62.369 C511.326,65.562 511.834,67.743 512.574,69.651 C513.342,71.625 514.368,73.296 516.035,74.965 C517.703,76.634 519.376,77.658 521.349,78.425 C523.257,79.167 525.438,79.673 528.631,79.82 C531.831,79.965 532.853,80.001 541,80.001 C549.148,80.001 550.169,79.965 553.369,79.82 C556.562,79.673 558.743,79.167 560.652,78.425 C562.623,77.658 564.297,76.634 565.965,74.965 C567.633,73.296 568.659,71.625 569.425,69.651 C570.167,67.743 570.674,65.562 570.82,62.369 C570.966,59.17 571,58.147 571,50 C571,41.851 570.966,40.831 570.82,37.631"></path></g></g></g></svg></div><div style="padding-top: 8px;"> <div style=" color:#3897f0; font-family:Arial,sans-serif; font-size:14px; font-style:normal; font-weight:550; line-height:18px;"> View this post on Instagram</div></div><div style="padding: 12.5% 0;"></div> <div style="display: flex; flex-direction: row; margin-bottom: 14px; align-items: center;"><div> <div style="background-color: #F4F4F4; border-radius: 50%; height: 12.5px; width: 12.5px; transform: translateX(0px) translateY(7px);"></div> <div style="background-color: #F4F4F4; height: 12.5px; transform: rotate(-45deg) translateX(3px) translateY(1px); width: 12.5px; flex-grow: 0; margin-right: 14px; margin-left: 2px;"></div> <div style="background-color: #F4F4F4; border-radius: 50%; height: 12.5px; width: 12.5px; transform: translateX(9px) translateY(-18px);"></div></div><div style="margin-left: 8px;"> <div style=" background-color: #F4F4F4; border-radius: 50%; flex-grow: 0; height: 20px; width: 20px;"></div> <div style=" width: 0; height: 0; border-top: 2px solid transparent; border-left: 6px solid #f4f4f4; border-bottom: 2px solid transparent; transform: translateX(16px) translateY(-4px) rotate(30deg)"></div></div><div style="margin-left: auto;"> <div style=" width: 0px; border-top: 8px solid #F4F4F4; border-right: 8px solid transparent; transform: translateY(16px);"></div> <div style=" background-color: #F4F4F4; flex-grow: 0; height: 12px; width: 16px; transform: translateY(-4px);"></div> <div style=" width: 0; height: 0; border-top: 8px solid #F4F4F4; border-left: 8px solid transparent; transform: translateY(-4px) translateX(8px);"></div></div></div></a> <p style=" margin:8px 0 0 0; padding:0 4px;"> <a href="https://www.instagram.com/tv/B95M4kNhbzz/?utm_source=ig_embed&amp;utm_campaign=loading" style=" color:#000; font-family:Arial,sans-serif; font-size:14px; font-style:normal; font-weight:normal; line-height:17px; text-decoration:none; word-wrap:break-word;" target="_blank">We are in this together, we will get through it together. Let’s imagine together. Sing with us ❤ All love to you, from me and my dear friends. #WeAreOne ....... #KristenWiig #JamieDornan @labrinth @james_marsden @sarahkatesilverman @eddiebenjamin @jimmyfallon @natalieportman @zoeisabellakravitz @siamusic @reallyndacarter @amyadams @leslieodomjr @pascalispunk @chrisodowd @hotpatooties #WillFerrell @markruffalo @norahjones @ashleybenson @kaiagerber @caradelevingne @anniemumolo @princesstagramslam</a></p> <p style=" color:#c9c8cd; font-family:Arial,sans-serif; font-size:14px; line-height:17px; margin-bottom:0; margin-top:8px; overflow:hidden; padding:8px 0 7px; text-align:center; text-overflow:ellipsis; white-space:nowrap;">A post shared by <a href="https://www.instagram.com/gal_gadot/?utm_source=ig_embed&amp;utm_campaign=loading" style=" color:#c9c8cd; font-family:Arial,sans-serif; font-size:14px; font-style:normal; font-weight:normal; line-height:17px;" target="_blank"> Gal Gadot</a> (@gal_gadot) on <time style=" font-family:Arial,sans-serif; font-size:14px; line-height:17px;" datetime="2020-03-18T23:49:48+00:00">Mar 18, 2020 at 4:49pm PDT</time></p></div></blockquote> <script async src="//www.instagram.com/embed.js"></script>`
        ).convertTo(OffsetSource);

        expect(serialize(doc, { withStableIds: true })).toMatchInlineSnapshot(`
          {
            "blocks": [
              {
                "attributes": {
                  "url": "https://www.instagram.com/tv/B95M4kNhbzz",
                },
                "id": "B00000000",
                "parents": [],
                "selfClosing": false,
                "type": "instagram-embed",
              },
            ],
            "marks": [],
            "text": "￼",
          }
        `);
      });

      test("Instagram Reel blockquote embed", () => {
        let doc = HTMLSource.fromRaw(
          `<blockquote class="instagram-media" data-instgrm-captioned data-instgrm-permalink="https://www.instagram.com/reel/CDt37vzFw3f/?utm_source=ig_web_copy_link" data-instgrm-version="12" style=" background:#FFF; border:0; border-radius:3px; box-shadow:0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15); margin: 1px; max-width:540px; min-width:326px; padding:0; width:99.375%; width:-webkit-calc(100% - 2px); width:calc(100% - 2px);"><div style="padding:16px;"> <a href="CDt37vzFw3f" style=" background:#FFFFFF; line-height:0; padding:0 0; text-align:center; text-decoration:none; width:100%;" target="_blank"> <div style=" display: flex; flex-direction: row; align-items: center;"> <div style="background-color: #F4F4F4; border-radius: 50%; flex-grow: 0; height: 40px; margin-right: 14px; width: 40px;"></div> <div style="display: flex; flex-direction: column; flex-grow: 1; justify-content: center;"> <div style=" background-color: #F4F4F4; border-radius: 4px; flex-grow: 0; height: 14px; margin-bottom: 6px; width: 100px;"></div> <div style=" background-color: #F4F4F4; border-radius: 4px; flex-grow: 0; height: 14px; width: 60px;"></div></div></div><div style="padding: 19% 0;"></div> <div style="display:block; height:50px; margin:0 auto 12px; width:50px;"><svg width="50px" height="50px" viewBox="0 0 60 60" version="1.1" xmlns="https://www.w3.org/2000/svg" xmlns:xlink="https://www.w3.org/1999/xlink"><g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g transform="translate(-511.000000, -20.000000)" fill="#000000"><g><path d="M556.869,30.41 C554.814,30.41 553.148,32.076 553.148,34.131 C553.148,36.186 554.814,37.852 556.869,37.852 C558.924,37.852 560.59,36.186 560.59,34.131 C560.59,32.076 558.924,30.41 556.869,30.41 M541,60.657 C535.114,60.657 530.342,55.887 530.342,50 C530.342,44.114 535.114,39.342 541,39.342 C546.887,39.342 551.658,44.114 551.658,50 C551.658,55.887 546.887,60.657 541,60.657 M541,33.886 C532.1,33.886 524.886,41.1 524.886,50 C524.886,58.899 532.1,66.113 541,66.113 C549.9,66.113 557.115,58.899 557.115,50 C557.115,41.1 549.9,33.886 541,33.886 M565.378,62.101 C565.244,65.022 564.756,66.606 564.346,67.663 C563.803,69.06 563.154,70.057 562.106,71.106 C561.058,72.155 560.06,72.803 558.662,73.347 C557.607,73.757 556.021,74.244 553.102,74.378 C549.944,74.521 548.997,74.552 541,74.552 C533.003,74.552 532.056,74.521 528.898,74.378 C525.979,74.244 524.393,73.757 523.338,73.347 C521.94,72.803 520.942,72.155 519.894,71.106 C518.846,70.057 518.197,69.06 517.654,67.663 C517.244,66.606 516.755,65.022 516.623,62.101 C516.479,58.943 516.448,57.996 516.448,50 C516.448,42.003 516.479,41.056 516.623,37.899 C516.755,34.978 517.244,33.391 517.654,32.338 C518.197,30.938 518.846,29.942 519.894,28.894 C520.942,27.846 521.94,27.196 523.338,26.654 C524.393,26.244 525.979,25.756 528.898,25.623 C532.057,25.479 533.004,25.448 541,25.448 C548.997,25.448 549.943,25.479 553.102,25.623 C556.021,25.756 557.607,26.244 558.662,26.654 C560.06,27.196 561.058,27.846 562.106,28.894 C563.154,29.942 563.803,30.938 564.346,32.338 C564.756,33.391 565.244,34.978 565.378,37.899 C565.522,41.056 565.552,42.003 565.552,50 C565.552,57.996 565.522,58.943 565.378,62.101 M570.82,37.631 C570.674,34.438 570.167,32.258 569.425,30.349 C568.659,28.377 567.633,26.702 565.965,25.035 C564.297,23.368 562.623,22.342 560.652,21.575 C558.743,20.834 556.562,20.326 553.369,20.18 C550.169,20.033 549.148,20 541,20 C532.853,20 531.831,20.033 528.631,20.18 C525.438,20.326 523.257,20.834 521.349,21.575 C519.376,22.342 517.703,23.368 516.035,25.035 C514.368,26.702 513.342,28.377 512.574,30.349 C511.834,32.258 511.326,34.438 511.181,37.631 C511.035,40.831 511,41.851 511,50 C511,58.147 511.035,59.17 511.181,62.369 C511.326,65.562 511.834,67.743 512.574,69.651 C513.342,71.625 514.368,73.296 516.035,74.965 C517.703,76.634 519.376,77.658 521.349,78.425 C523.257,79.167 525.438,79.673 528.631,79.82 C531.831,79.965 532.853,80.001 541,80.001 C549.148,80.001 550.169,79.965 553.369,79.82 C556.562,79.673 558.743,79.167 560.652,78.425 C562.623,77.658 564.297,76.634 565.965,74.965 C567.633,73.296 568.659,71.625 569.425,69.651 C570.167,67.743 570.674,65.562 570.82,62.369 C570.966,59.17 571,58.147 571,50 C571,41.851 570.966,40.831 570.82,37.631"></path></g></g></g></svg></div><div style="padding-top: 8px;"> <div style=" color:#3897f0; font-family:Arial,sans-serif; font-size:14px; font-style:normal; font-weight:550; line-height:18px;"> View this post on Instagram</div></div><div style="padding: 12.5% 0;"></div> <div style="display: flex; flex-direction: row; margin-bottom: 14px; align-items: center;"><div> <div style="background-color: #F4F4F4; border-radius: 50%; height: 12.5px; width: 12.5px; transform: translateX(0px) translateY(7px);"></div> <div style="background-color: #F4F4F4; height: 12.5px; transform: rotate(-45deg) translateX(3px) translateY(1px); width: 12.5px; flex-grow: 0; margin-right: 14px; margin-left: 2px;"></div> <div style="background-color: #F4F4F4; border-radius: 50%; height: 12.5px; width: 12.5px; transform: translateX(9px) translateY(-18px);"></div></div><div style="margin-left: 8px;"> <div style=" background-color: #F4F4F4; border-radius: 50%; flex-grow: 0; height: 20px; width: 20px;"></div> <div style=" width: 0; height: 0; border-top: 2px solid transparent; border-left: 6px solid #f4f4f4; border-bottom: 2px solid transparent; transform: translateX(16px) translateY(-4px) rotate(30deg)"></div></div><div style="margin-left: auto;"> <div style=" width: 0px; border-top: 8px solid #F4F4F4; border-right: 8px solid transparent; transform: translateY(16px);"></div> <div style=" background-color: #F4F4F4; flex-grow: 0; height: 12px; width: 16px; transform: translateY(-4px);"></div> <div style=" width: 0; height: 0; border-top: 8px solid #F4F4F4; border-left: 8px solid transparent; transform: translateY(-4px) translateX(8px);"></div></div></div></a> <p style=" margin:8px 0 0 0; padding:0 4px;"> <a href="https://www.instagram.com/reel/CDt37vzFw3f/?utm_source=ig_web_copy_link" style=" color:#000; font-family:Arial,sans-serif; font-size:14px; font-style:normal; font-weight:normal; line-height:17px; text-decoration:none; word-wrap:break-word;" target="_blank">We are in this together, we will get through it together. Let’s imagine together. Sing with us ❤ All love to you, from me and my dear friends. #WeAreOne ....... #KristenWiig #JamieDornan @labrinth @james_marsden @sarahkatesilverman @eddiebenjamin @jimmyfallon @natalieportman @zoeisabellakravitz @siamusic @reallyndacarter @amyadams @leslieodomjr @pascalispunk @chrisodowd @hotpatooties #WillFerrell @markruffalo @norahjones @ashleybenson @kaiagerber @caradelevingne @anniemumolo @princesstagramslam</a></p> <p style=" color:#c9c8cd; font-family:Arial,sans-serif; font-size:14px; line-height:17px; margin-bottom:0; margin-top:8px; overflow:hidden; padding:8px 0 7px; text-align:center; text-overflow:ellipsis; white-space:nowrap;">A post shared by <a href="https://www.instagram.com/gal_gadot/?utm_source=ig_embed&amp;utm_campaign=loading" style=" color:#c9c8cd; font-family:Arial,sans-serif; font-size:14px; font-style:normal; font-weight:normal; line-height:17px;" target="_blank"> Gal Gadot</a> (@gal_gadot) on <time style=" font-family:Arial,sans-serif; font-size:14px; line-height:17px;" datetime="2020-03-18T23:49:48+00:00">Mar 18, 2020 at 4:49pm PDT</time></p></div></blockquote> <script async src="//www.instagram.com/embed.js"></script>`
        ).convertTo(OffsetSource);

        expect(serialize(doc, { withStableIds: true })).toMatchInlineSnapshot(`
          {
            "blocks": [
              {
                "attributes": {
                  "url": "https://www.instagram.com/reel/CDt37vzFw3f",
                },
                "id": "B00000000",
                "parents": [],
                "selfClosing": false,
                "type": "instagram-embed",
              },
            ],
            "marks": [],
            "text": "￼",
          }
        `);
      });

      test("Twitter blockquote embed", () => {
        let doc = HTMLSource.fromRaw(
          `<blockquote class="twitter-tweet"><p lang="en" dir="ltr">Hope you had a great start to your week, New York City! <a href="https://t.co/9skas4Bady">pic.twitter.com/9skas4Bady</a></p>&mdash; City of New York (@nycgov) <a href="https://twitter.com/nycgov/status/1191528054608334848?ref_src=twsrc%5Etfw">November 5, 2019</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>`
        ).convertTo(OffsetSource);

        expect(serialize(doc, { withStableIds: true })).toMatchInlineSnapshot(`
          {
            "blocks": [
              {
                "attributes": {
                  "url": "https://twitter.com/nycgov/status/1191528054608334848",
                },
                "id": "B00000000",
                "parents": [],
                "selfClosing": false,
                "type": "twitter-embed",
              },
            ],
            "marks": [],
            "text": "￼",
          }
        `);
      });

      test("Giphy embed", () => {
        let doc = HTMLSource.fromRaw(
          `<iframe src="https://giphy.com/embed/13CoXDiaCcCoyk" width="480" height="398" frameBorder="0" class="giphy-embed" allowFullScreen></iframe><p><a href="https://giphy.com/gifs/wiggle-shaq-13CoXDiaCcCoyk">via GIPHY</a></p>`
        ).convertTo(OffsetSource);

        expect(serialize(doc, { withStableIds: true })).toMatchInlineSnapshot(`
          {
            "blocks": [
              {
                "attributes": {
                  "height": "398",
                  "url": "https://giphy.com/embed/13CoXDiaCcCoyk",
                  "width": "480",
                },
                "id": "B00000000",
                "parents": [],
                "selfClosing": false,
                "type": "giphy-embed",
              },
            ],
            "marks": [],
            "text": "￼",
          }
        `);
      });

      test("Spotify podcast show embed", () => {
        let doc = HTMLSource.fromRaw(
          `<iframe src="https://open.spotify.com/embed-podcast/show/1iohmBNlRooIVtukKeavRa"
            width="100%"
            height="232"
            frameborder="0"
            allowtransparency="true"
            allow="encrypted-media"></iframe>`
        ).convertTo(OffsetSource);

        expect(serialize(doc, { withStableIds: true })).toMatchInlineSnapshot(`
          {
            "blocks": [
              {
                "attributes": {
                  "height": "232",
                  "url": "https://open.spotify.com/embed-podcast/show/1iohmBNlRooIVtukKeavRa",
                  "width": "100%",
                },
                "id": "B00000000",
                "parents": [],
                "selfClosing": false,
                "type": "iframe-embed",
              },
            ],
            "marks": [],
            "text": "￼",
          }
        `);
      });

      test("Spotify track embed", () => {
        let doc = HTMLSource.fromRaw(
          `<iframe src="https://open.spotify.com/embed/track/1QY4TdhuNIOX2SHLdElzd5"
            width="300"
            height="380"
            frameborder="0"
            allowtransparency="true"
            allow="encrypted-media"></iframe>`
        ).convertTo(OffsetSource);

        expect(serialize(doc, { withStableIds: true })).toMatchInlineSnapshot(`
          {
            "blocks": [
              {
                "attributes": {
                  "height": "380",
                  "url": "https://open.spotify.com/embed/track/1QY4TdhuNIOX2SHLdElzd5",
                  "width": "300",
                },
                "id": "B00000000",
                "parents": [],
                "selfClosing": false,
                "type": "iframe-embed",
              },
            ],
            "marks": [],
            "text": "￼",
          }
        `);
      });
    });

    describe("video embeds", () => {
      describe("YouTube", () => {
        test.each([
          ["https://www.youtube.com/embed/0-jus6AGHzQ"],
          ["https://www.youtube-nocookie.com/embed/0-jus6AGHzQ?controls=0"],
          ["//www.youtube-nocookie.com/embed/0-jus6AGHzQ?controls=0"],
        ])("%s", (url) => {
          let doc = HTMLSource.fromRaw(
            `<iframe width="560" height="315"
            src="${url}"
            frameborder="0"
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen></iframe>`
          ).convertTo(OffsetSource);

          if (url.startsWith("//")) {
            url = `https:${url}`;
          }
          expect(serialize(doc)).toMatchObject({
            text: "\uFFFC",
            blocks: [
              {
                type: "video-embed",
                attributes: {
                  url,
                  provider: VideoURLs.Provider.YOUTUBE,
                  width: 560,
                  height: 315,
                  aspectRatio: "16:9",
                },
                parents: [],
              },
            ],
          });
        });
      });

      describe("Vimeo", () => {
        test("default embed code (with caption)", () => {
          let html = `<iframe src="https://player.vimeo.com/video/156254412" width="640" height="480" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe><p><a href="https://vimeo.com/156254412">TSVETOK - Vogue Italia</a> from <a href="https://vimeo.com/karimandreotti">Karim Andreotti</a> on <a href="https://vimeo.com">Vimeo</a>.</p>`;
          let doc = HTMLSource.fromRaw(html).convertTo(OffsetSource);

          expect(serialize(doc, { withStableIds: true }))
            .toMatchInlineSnapshot(`
            {
              "blocks": [
                {
                  "attributes": {
                    "aspectRatio": "4:3",
                    "caption": "M00000000",
                    "height": 480,
                    "provider": "VIMEO",
                    "url": "https://player.vimeo.com/video/156254412",
                    "width": 640,
                  },
                  "id": "B00000000",
                  "parents": [],
                  "selfClosing": false,
                  "type": "video-embed",
                },
                {
                  "attributes": {},
                  "id": "B00000001",
                  "parents": [],
                  "selfClosing": false,
                  "type": "text",
                },
              ],
              "marks": [
                {
                  "attributes": {
                    "refs": [
                      "B00000000",
                    ],
                  },
                  "id": "M00000000",
                  "range": "(1..55]",
                  "type": "slice",
                },
                {
                  "attributes": {
                    "url": "https://vimeo.com/156254412",
                  },
                  "id": "M00000001",
                  "range": "(2..24)",
                  "type": "link",
                },
                {
                  "attributes": {
                    "url": "https://vimeo.com/karimandreotti",
                  },
                  "id": "M00000002",
                  "range": "(30..45)",
                  "type": "link",
                },
                {
                  "attributes": {
                    "url": "https://vimeo.com",
                  },
                  "id": "M00000003",
                  "range": "(49..54)",
                  "type": "link",
                },
              ],
              "text": "￼￼TSVETOK - Vogue Italia from Karim Andreotti on Vimeo.",
            }
          `);
        });

        test("protocol-relative URLs https", () => {
          let doc = HTMLSource.fromRaw(
            `<iframe src="//player.vimeo.com/video/156254412" width="640" height="480" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe>`
          ).convertTo(OffsetSource);

          expect(serialize(doc, { withStableIds: true }))
            .toMatchInlineSnapshot(`
            {
              "blocks": [
                {
                  "attributes": {
                    "aspectRatio": "4:3",
                    "height": 480,
                    "provider": "VIMEO",
                    "url": "https://player.vimeo.com/video/156254412",
                    "width": 640,
                  },
                  "id": "B00000000",
                  "parents": [],
                  "selfClosing": false,
                  "type": "video-embed",
                },
              ],
              "marks": [],
              "text": "￼",
            }
          `);
        });

        test("embed code with trailing paragraph that isn't from Vimeo", () => {
          let doc = HTMLSource.fromRaw(
            `<iframe src="https://player.vimeo.com/video/156254412" width="640" height="480" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe>
<p>Hello, this is something from <a href="https://vogue.it">Vogue Italia</a>!</p>`
          ).convertTo(OffsetSource);

          expect(serialize(doc, { withStableIds: true }))
            .toMatchInlineSnapshot(`
            {
              "blocks": [
                {
                  "attributes": {
                    "aspectRatio": "4:3",
                    "height": 480,
                    "provider": "VIMEO",
                    "url": "https://player.vimeo.com/video/156254412",
                    "width": 640,
                  },
                  "id": "B00000000",
                  "parents": [],
                  "selfClosing": false,
                  "type": "video-embed",
                },
                {
                  "attributes": {},
                  "id": "B00000001",
                  "parents": [],
                  "selfClosing": false,
                  "type": "text",
                },
                {
                  "attributes": {},
                  "id": "B00000002",
                  "parents": [],
                  "selfClosing": false,
                  "type": "paragraph",
                },
              ],
              "marks": [
                {
                  "attributes": {
                    "url": "https://vogue.it",
                  },
                  "id": "M00000000",
                  "range": "(34..46)",
                  "type": "link",
                },
              ],
              "text": "￼￼
            ￼Hello, this is something from Vogue Italia!",
            }
          `);
        });

        test("embed code without caption", () => {
          let doc = HTMLSource.fromRaw(
            `<iframe src="https://player.vimeo.com/video/156254412" width="640" height="480" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe>`
          ).convertTo(OffsetSource);

          expect(serialize(doc, { withStableIds: true }))
            .toMatchInlineSnapshot(`
            {
              "blocks": [
                {
                  "attributes": {
                    "aspectRatio": "4:3",
                    "height": 480,
                    "provider": "VIMEO",
                    "url": "https://player.vimeo.com/video/156254412",
                    "width": 640,
                  },
                  "id": "B00000000",
                  "parents": [],
                  "selfClosing": false,
                  "type": "video-embed",
                },
              ],
              "marks": [],
              "text": "￼",
            }
          `);
        });
      });

      test("Dailymotion", () => {
        let doc = HTMLSource.fromRaw(
          `<iframe frameborder="0" width="480" height="270" src="https://www.dailymotion.com/embed/video/x6gmvnp" allowfullscreen allow="autoplay"></iframe>`
        ).convertTo(OffsetSource);

        expect(serialize(doc, { withStableIds: true })).toMatchInlineSnapshot(`
          {
            "blocks": [
              {
                "attributes": {
                  "aspectRatio": "16:9",
                  "height": 270,
                  "provider": "DAILYMOTION",
                  "url": "https://www.dailymotion.com/embed/video/x6gmvnp",
                  "width": 480,
                },
                "id": "B00000000",
                "parents": [],
                "selfClosing": false,
                "type": "video-embed",
              },
            ],
            "marks": [],
            "text": "￼",
          }
        `);
      });

      test("Brightcove", () => {
        let doc = HTMLSource.fromRaw(
          `<div style="position: relative; display: block; max-width: 640px;">
  <div style="padding-top: 56.25%;">
    <iframe src="https://players.brightcove.net/1752604059001/default_default/index.html?videoId=5802784116001"
      allowfullscreen
      webkitallowfullscreen
      mozallowfullscreen
      style="position: absolute; top: 0px; right: 0px; bottom: 0px; left: 0px; width: 100%; height: 100%;">
    </iframe>
  </div>
</div>`
        ).convertTo(OffsetSource);

        expect(serialize(doc, { withStableIds: true })).toMatchInlineSnapshot(`
          {
            "blocks": [
              {
                "attributes": {},
                "id": "B00000000",
                "parents": [],
                "selfClosing": false,
                "type": "text",
              },
              {
                "attributes": {
                  "aspectRatio": "16:9",
                  "height": 360,
                  "provider": "BRIGHTCOVE",
                  "url": "https://players.brightcove.net/1752604059001/default_default/index.html?videoId=5802784116001",
                  "width": 640,
                },
                "id": "B00000001",
                "parents": [],
                "selfClosing": false,
                "type": "video-embed",
              },
              {
                "attributes": {},
                "id": "B00000002",
                "parents": [],
                "selfClosing": false,
                "type": "text",
              },
            ],
            "marks": [],
            "text": "￼
            
              ￼
              ￼
            
          ",
          }
        `);
      });

      test("Twitch videos", () => {
        let doc = HTMLSource.fromRaw(
          `<iframe src="https://player.twitch.tv/?video=956002196&parent=www.example.com" frameborder="0" allowfullscreen="true" scrolling="no" height="378" width="620"></iframe>`
        ).convertTo(OffsetSource);

        expect(serialize(doc, { withStableIds: true })).toMatchInlineSnapshot(`
          {
            "blocks": [
              {
                "attributes": {
                  "aspectRatio": "5:3",
                  "height": 378,
                  "provider": "TWITCH",
                  "url": "https://player.twitch.tv/?video=956002196&parent=www.example.com",
                  "width": 620,
                },
                "id": "B00000000",
                "parents": [],
                "selfClosing": false,
                "type": "video-embed",
              },
            ],
            "marks": [],
            "text": "￼",
          }
        `);
      });

      test("Twitch clips", () => {
        let doc = HTMLSource.fromRaw(
          `<iframe src="https://clips.twitch.tv/embed?clip=StrongBlueWaterDoubleRainbow&parent=www.example.com" frameborder="0" allowfullscreen="true" scrolling="no" height="378" width="620"></iframe>`
        ).convertTo(OffsetSource);

        expect(serialize(doc, { withStableIds: true })).toMatchInlineSnapshot(`
          {
            "blocks": [
              {
                "attributes": {
                  "aspectRatio": "5:3",
                  "height": 378,
                  "provider": "TWITCH",
                  "url": "https://clips.twitch.tv/embed?clip=StrongBlueWaterDoubleRainbow&parent=www.example.com",
                  "width": 620,
                },
                "id": "B00000000",
                "parents": [],
                "selfClosing": false,
                "type": "video-embed",
              },
            ],
            "marks": [],
            "text": "￼",
          }
        `);
      });

      test("Wirewax", () => {
        let doc = HTMLSource.fromRaw(
          `<iframe style="position: absolute; top: 0; left: 0;" width="100%" height="100%" src="https://embedder.wirewax.com/8203724/" frameborder="0" scrolling="yes" allowfullscreen></iframe>`
        ).convertTo(OffsetSource);

        expect(serialize(doc, { withStableIds: true })).toMatchInlineSnapshot(`
          {
            "blocks": [
              {
                "attributes": {
                  "aspectRatio": "1:1",
                  "height": 100,
                  "provider": "WIREWAX",
                  "url": "https://embedder.wirewax.com/8203724",
                  "width": 100,
                },
                "id": "B00000000",
                "parents": [],
                "selfClosing": false,
                "type": "video-embed",
              },
            ],
            "marks": [],
            "text": "￼",
          }
        `);
      });
    });

    describe("Third Party embeds", () => {
      describe("Ceros embeds", () => {
        test("with mobileAspectRatio", () => {
          let doc = HTMLSource.fromRaw(
            `<div style="position: relative;width: auto;padding: 0 0 50%;height: 0;top: 0;left: 0;bottom: 0;right: 0;margin: 0;border: 0 none" id="experience-test" data-aspectRatio="2.01" data-mobile-aspectRatio="3.2"><iframe allowfullscreen src="//view.ceros.com/ceros-inspire/carousel-3" style="position: absolute;top: 0;left: 0;bottom: 0;right: 0;margin: 0;padding: 0;border: 0 none;height: 1px;width: 1px;min-height: 100%;min-width: 100%" frameborder="0" class="ceros-experience" scrolling="no"></iframe></div><script type="text/javascript" src="//view.ceros.com/scroll-proxy.min.js"></script>`
          ).convertTo(OffsetSource);

          expect(serialize(doc, { withStableIds: true }))
            .toMatchInlineSnapshot(`
            {
              "blocks": [
                {
                  "attributes": {
                    "aspectRatio": 2.01,
                    "mobileAspectRatio": 3.2,
                    "url": "//view.ceros.com/ceros-inspire/carousel-3",
                  },
                  "id": "B00000000",
                  "parents": [],
                  "selfClosing": false,
                  "type": "ceros-embed",
                },
              ],
              "marks": [],
              "text": "￼",
            }
          `);
        });

        test("without mobileAspectRatio", () => {
          let doc = HTMLSource.fromRaw(
            `<div style="position: relative;width: auto;padding: 0 0 50%;height: 0;top: 0;left: 0;bottom: 0;right: 0;margin: 0;border: 0 none" id="experience-test" data-aspectRatio="2"><iframe allowfullscreen src="//view.ceros.com/ceros-inspire/carousel-3" style="position: absolute;top: 0;left: 0;bottom: 0;right: 0;margin: 0;padding: 0;border: 0 none;height: 1px;width: 1px;min-height: 100%;min-width: 100%" frameborder="0" class="ceros-experience" scrolling="no"></iframe></div><script type="text/javascript" src="//view.ceros.com/scroll-proxy.min.js"></script>`
          ).convertTo(OffsetSource);

          expect(serialize(doc, { withStableIds: true }))
            .toMatchInlineSnapshot(`
            {
              "blocks": [
                {
                  "attributes": {
                    "aspectRatio": 2,
                    "url": "//view.ceros.com/ceros-inspire/carousel-3",
                  },
                  "id": "B00000000",
                  "parents": [],
                  "selfClosing": false,
                  "type": "ceros-embed",
                },
              ],
              "marks": [],
              "text": "￼",
            }
          `);
        });

        test("with a trailing blank script tag", () => {
          expect(() => {
            HTMLSource.fromRaw(
              `<div style="position: relative;width: auto;padding: 0 0 50%;height: 0;top: 0;left: 0;bottom: 0;right: 0;margin: 0;border: 0 none" id="experience-test" data-aspectRatio="2"><iframe allowfullscreen src="//view.ceros.com/ceros-inspire/carousel-3" style="position: absolute;top: 0;left: 0;bottom: 0;right: 0;margin: 0;padding: 0;border: 0 none;height: 1px;width: 1px;min-height: 100%;min-width: 100%" frameborder="0" class="ceros-experience" scrolling="no"></iframe></div><script type="text/javascript"></script>`
            ).convertTo(OffsetSource);
          }).not.toThrow();
        });

        test("followed by a non-ceros script tag", () => {
          let doc = HTMLSource.fromRaw(
            `<div style="position: relative;width: auto;padding: 0 0 50%;height: 0;top: 0;left: 0;bottom: 0;right: 0;margin: 0;border: 0 none" id="experience-test" data-aspectRatio="2"><iframe allowfullscreen src="//view.ceros.com/ceros-inspire/carousel-3" style="position: absolute;top: 0;left: 0;bottom: 0;right: 0;margin: 0;padding: 0;border: 0 none;height: 1px;width: 1px;min-height: 100%;min-width: 100%" frameborder="0" class="ceros-experience" scrolling="no"></iframe></div><script type="text/javascript" src="https://www.example.com/my-script.js"></script>`
          ).convertTo(OffsetSource);

          expect(serialize(doc, { withStableIds: true }))
            .toMatchInlineSnapshot(`
            {
              "blocks": [
                {
                  "attributes": {
                    "aspectRatio": 2,
                    "url": "//view.ceros.com/ceros-inspire/carousel-3",
                  },
                  "id": "B00000000",
                  "parents": [],
                  "selfClosing": false,
                  "type": "ceros-embed",
                },
              ],
              "marks": [
                {
                  "attributes": {
                    "-html-src": "https://www.example.com/my-script.js",
                    "-html-type": "text/javascript",
                  },
                  "id": "M00000000",
                  "range": "(1..1]",
                  "type": "-html-script",
                },
              ],
              "text": "￼",
            }
          `);
        });
      });
    });
    describe("Reddit Embeds", () => {
      test("Reddit Embed code", () => {
        let doc = HTMLSource.fromRaw(
          `<iframe id="reddit-embed"
          src="https://www.redditmedia.com/r/IndianDankMemes/comments/qlndlm/average_indian_family/?ref_source=embed&amp;ref=share&amp;embed=true"
          sandbox="allow-scripts allow-same-origin allow-popups"
          height="476"
          width="640"
          scrolling="no"></iframe>`
        ).convertTo(OffsetSource);

        expect(serialize(doc, { withStableIds: true })).toMatchInlineSnapshot(`
          {
            "blocks": [
              {
                "attributes": {
                  "anchorName": "reddit-embed",
                  "height": "476",
                  "sandbox": "allow-scripts allow-same-origin allow-popups",
                  "url": "https://www.redditmedia.com/r/IndianDankMemes/comments/qlndlm/average_indian_family/?ref_source=embed&ref=share&embed=true&showmedia=false",
                  "width": "640",
                },
                "id": "B00000000",
                "parents": [],
                "selfClosing": false,
                "type": "iframe-embed",
              },
            ],
            "marks": [],
            "text": "￼",
          }
        `);
      });

      test("Reddit Embed code", () => {
        let doc = HTMLSource.fromRaw(
          `<iframe id="reddit-embed"
          src="https://www.redditmedia.com/r/HollywoodUndead/comments/qoozk2/danny_solo_projecttreading_water/?ref_source=embed&amp;ref=share&amp;embed=true&amp;showmedia=false&amp;showedits=false&amp;created=2021-11-08T13%3A42%3A20.393Z"
          sandbox="allow-scripts allow-same-origin allow-popups"
          style="border: none;"
          height="126"
          width="640"
          scrolling="no"></iframe>`
        ).convertTo(OffsetSource);

        expect(serialize(doc, { withStableIds: true })).toMatchInlineSnapshot(`
          {
            "blocks": [
              {
                "attributes": {
                  "anchorName": "reddit-embed",
                  "height": "126",
                  "sandbox": "allow-scripts allow-same-origin allow-popups",
                  "url": "https://www.redditmedia.com/r/HollywoodUndead/comments/qoozk2/danny_solo_projecttreading_water/?ref_source=embed&ref=share&embed=true&showmedia=false&showedits=false&created=2021-11-08T13%3A42%3A20.393Z",
                  "width": "640",
                },
                "id": "B00000000",
                "parents": [],
                "selfClosing": false,
                "type": "iframe-embed",
              },
            ],
            "marks": [],
            "text": "￼",
          }
        `);
      });
    });
    describe("TikTok", () => {
      test("from embed dialog", () => {
        let doc = HTMLSource.fromRaw(
          `<blockquote class="tiktok-embed" cite="https://www.tiktok.com/@teenvogue/video/292170367534714880" data-video-id="292170367534714880" style="max-width: 605px;min-width: 325px;" > <section> <a target="_blank" title="@teenvogue" href="https://www.tiktok.com/@teenvogue">@teenvogue</a> <p>When officialayoteo ask to hold your phone 🕴🏾🕴🏾</p> <a target="_blank" title="♬ Better Off Alone - Ayo & Teo" href="https://www.tiktok.com/music/Better-Off-Alone-264491379257659392">♬ Better Off Alone - Ayo & Teo</a> </section> </blockquote> <script async src="https://www.tiktok.com/embed.js"></script>`
        ).convertTo(OffsetSource);

        expect(serialize(doc, { withStableIds: true })).toMatchInlineSnapshot(`
          {
            "blocks": [
              {
                "attributes": {
                  "url": "https://www.tiktok.com/@teenvogue/video/292170367534714880",
                },
                "id": "B00000000",
                "parents": [],
                "selfClosing": false,
                "type": "tiktok-embed",
              },
            ],
            "marks": [],
            "text": "￼",
          }
        `);
      });

      test("from html rendered output", () => {
        let doc = HTMLSource.fromRaw(
          `<blockquote class="tiktok-embed" cite="https://www.tiktok.com/@teenvogue/video/292170367534714880" data-video-id="292170367534714880" style="max-width: 605px;min-width: 325px;"><section><a target="_blank" title="@teenvogue" href="https://www.tiktok.com/@teenvogue">@teenvogue</a></section></blockquote><script async src="https://www.tiktok.com/embed.js"></script>`
        ).convertTo(OffsetSource);

        expect(serialize(doc, { withStableIds: true })).toMatchInlineSnapshot(`
          {
            "blocks": [
              {
                "attributes": {
                  "url": "https://www.tiktok.com/@teenvogue/video/292170367534714880",
                },
                "id": "B00000000",
                "parents": [],
                "selfClosing": false,
                "type": "tiktok-embed",
              },
            ],
            "marks": [],
            "text": "￼",
          }
        `);
      });
    });

    describe("CNE Audio", () => {
      test("script", () => {
        let doc = HTMLSource.fromRaw(
          `<script src="https://embed-audio.cnevids.com/script/episode/bb2ef05b-de71-469a-b0a5-829f2a54dac6?skin=vf&target=js-audio1" defer></script><div id="js-audio1"></div>`
        ).convertTo(OffsetSource);

        expect(serialize(doc, { withStableIds: true })).toMatchInlineSnapshot(`
          {
            "blocks": [
              {
                "attributes": {
                  "audioId": "bb2ef05b-de71-469a-b0a5-829f2a54dac6",
                  "audioType": "episode",
                },
                "id": "B00000000",
                "parents": [],
                "selfClosing": false,
                "type": "cne-audio-embed",
              },
            ],
            "marks": [],
            "text": "￼",
          }
        `);
      });

      test("iframe", () => {
        let doc = HTMLSource.fromRaw(
          `<iframe src="https://embed-audio.cnevids.com/iframe/episode/bb2ef05b-de71-469a-b0a5-829f2a54dac6?skin=vf" frameborder="0" height="244" sandbox=allow-scripts allow-popups allow-popups-to-escape-sandbox"></iframe>`
        ).convertTo(OffsetSource);

        expect(serialize(doc, { withStableIds: true })).toMatchInlineSnapshot(`
          {
            "blocks": [
              {
                "attributes": {
                  "audioId": "bb2ef05b-de71-469a-b0a5-829f2a54dac6",
                  "audioType": "episode",
                },
                "id": "B00000000",
                "parents": [],
                "selfClosing": false,
                "type": "cne-audio-embed",
              },
            ],
            "marks": [],
            "text": "￼",
          }
        `);
      });

      test("equality", () => {
        expect(
          serialize(
            HTMLSource.fromRaw(
              `<iframe src="https://embed-audio.cnevids.com/iframe/episode/bb2ef05b-de71-469a-b0a5-829f2a54dac6?skin=vf" frameborder="0" height="244" sandbox=allow-scripts allow-popups allow-popups-to-escape-sandbox"></iframe>`
            ).convertTo(OffsetSource),
            { withStableIds: true }
          )
        ).toEqual(
          serialize(
            HTMLSource.fromRaw(
              `<script src="https://embed-audio.cnevids.com/script/episode/bb2ef05b-de71-469a-b0a5-829f2a54dac6?skin=vf&target=js-audio1" defer></script><div id="js-audio1"></div>`
            ).convertTo(OffsetSource),
            { withStableIds: true }
          )
        );
      });
    });
  });
});
