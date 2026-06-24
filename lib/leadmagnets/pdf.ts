import "server-only";

import PDFDocument from "pdfkit";
import type { Guide, GuideBodyBlock } from "@/lib/guides/types";

// Build a printable PDF from a guide's article content. Renders the subset of
// blocks that make sense out-of-context (p/h3/quote) and skips on-page UI
// (stats/cta/leadmagnet). The result is what a visitor receives by email when
// they fill the lead-magnet form on the guide.

const FONT_BODY = "Helvetica";
const FONT_BODY_BOLD = "Helvetica-Bold";
const FONT_HEADING = "Times-Roman";
const FONT_HEADING_ITALIC = "Times-Italic";

const COLOR_TEXT = "#1a120c";
const COLOR_MUTED = "#564c44";
const COLOR_ACCENT = "#9d4d2a";
const COLOR_RULE = "#d5d0cc";

// Strip the `[[label|/href]]` inline-link markup; the PDF is offline copy so
// the link text alone is enough (and the href would just be noise).
function stripInlineLinks(text: string): string {
  return text.replace(/\[\[([^\]|]+)\|[^\]]+\]\]/g, "$1");
}

export function generateLeadMagnetPdf({
  guide,
  title,
  siteUrl,
}: {
  guide: Guide;
  title: string;
  siteUrl: string;
}): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: "A4",
      margins: { top: 64, bottom: 72, left: 64, right: 64 },
      info: { Title: title, Author: "Max. Property", Creator: "maxproperty.au" },
    });

    const chunks: Buffer[] = [];
    doc.on("data", (chunk: Buffer) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    // ── Cover ──────────────────────────────────────────────────────────
    doc.font(FONT_BODY).fontSize(10).fillColor(COLOR_ACCENT)
      .text("MAX. PROPERTY · NOOSAVILLE", { characterSpacing: 1.5 });
    doc.moveDown(2);
    doc.font(FONT_HEADING).fontSize(28).fillColor(COLOR_TEXT)
      .text(title, { lineGap: 4 });
    doc.moveDown(0.5);
    doc.font(FONT_HEADING_ITALIC).fontSize(13).fillColor(COLOR_MUTED)
      .text(guide.hero.dek, { lineGap: 2 });
    doc.moveDown(2);

    // Accent rule under the dek.
    const ruleY = doc.y;
    doc.strokeColor(COLOR_ACCENT).lineWidth(2)
      .moveTo(64, ruleY).lineTo(64 + 64, ruleY).stroke();
    doc.moveDown(2);

    // ── Body ───────────────────────────────────────────────────────────
    for (const section of guide.sections) {
      const renderable = section.blocks.filter(isPrintable);
      if (renderable.length === 0) continue;

      if (section.heading) {
        // Pull a section onto a new page if there's not enough room for the
        // heading + a couple of body lines — avoids orphaned H2s at page foot.
        if (doc.y > doc.page.height - 200) doc.addPage();
        doc.font(FONT_HEADING).fontSize(18).fillColor(COLOR_TEXT)
          .text(section.heading, { lineGap: 2 });
        doc.moveDown(0.5);
      }

      for (const block of renderable) {
        renderBlock(doc, block);
        doc.moveDown(0.6);
      }
      doc.moveDown(0.4);
    }

    // ── Footer (page numbers + site URL) ───────────────────────────────
    const range = doc.bufferedPageRange();
    for (let i = 0; i < range.count; i++) {
      doc.switchToPage(range.start + i);
      const footerY = doc.page.height - 48;
      doc.font(FONT_BODY).fontSize(9).fillColor(COLOR_MUTED);
      doc.text(siteUrl.replace(/^https?:\/\//, ""), 64, footerY, {
        lineBreak: false,
      });
      doc.text(`${i + 1} / ${range.count}`, 0, footerY, {
        align: "right",
        lineBreak: false,
      });
      doc.strokeColor(COLOR_RULE).lineWidth(0.5)
        .moveTo(64, footerY - 8)
        .lineTo(doc.page.width - 64, footerY - 8)
        .stroke();
    }

    doc.end();
  });
}

type PrintableBlock = Extract<GuideBodyBlock, { kind: "p" | "h3" | "quote" }>;

function isPrintable(b: GuideBodyBlock): b is PrintableBlock {
  return b.kind === "p" || b.kind === "h3" || b.kind === "quote";
}

function renderBlock(doc: PDFKit.PDFDocument, block: PrintableBlock) {
  if (block.kind === "h3") {
    doc.font(FONT_BODY_BOLD).fontSize(12).fillColor(COLOR_TEXT)
      .text(block.text, { lineGap: 1 });
    return;
  }
  if (block.kind === "quote") {
    const startY = doc.y;
    doc.font(FONT_HEADING_ITALIC).fontSize(14).fillColor(COLOR_TEXT)
      .text(stripInlineLinks(block.text), 80, startY, {
        width: doc.page.width - 80 - 64,
        lineGap: 2,
      });
    const endY = doc.y;
    doc.strokeColor(COLOR_ACCENT).lineWidth(2)
      .moveTo(72, startY).lineTo(72, endY).stroke();
    return;
  }
  doc.font(FONT_BODY).fontSize(11).fillColor(COLOR_TEXT)
    .text(stripInlineLinks(block.text), { lineGap: 2, align: "left" });
}
