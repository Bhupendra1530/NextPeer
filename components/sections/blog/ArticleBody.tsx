import { Fragment } from "react";

export function headingId(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function inline(text: string) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith("**") && part.endsWith("**") ? <strong key={i}>{part.slice(2, -2)}</strong> : part
  );
}

export default function ArticleBody({ content }: { content: string }) {
  const lines = content.trim().split("\n");
  const blocks = [];
  for (let i = 0; i < lines.length; i++) {
    const text = lines[i].trim();
    if (!text) continue;
    if (text.startsWith("```")) {
      const code = [];
      while (++i < lines.length && !lines[i].trim().startsWith("```")) code.push(lines[i]);
      blocks.push(<pre key={i} className="my-6 overflow-x-auto rounded-xl bg-slate-900 p-5 text-sm leading-7 text-slate-100"><code>{code.join("\n")}</code></pre>);
    } else if (text.startsWith("#")) {
      const title = text.replace(/^#{1,3}\s+/, "");
      const Heading = text.startsWith("### ") ? "h3" : "h2";
      blocks.push(<Heading key={i} id={headingId(title)} className="mb-4 mt-10 scroll-mt-24 text-2xl font-bold tracking-tight text-slate-900">{inline(title)}</Heading>);
    } else if (/^\d+\.\s/.test(text) || text.startsWith("- ")) {
      const ordered = /^\d+\.\s/.test(text);
      const List = ordered ? "ol" : "ul";
      const items = [];
      const start = ordered ? Number(text.match(/^\d+/)?.[0]) : undefined;
      while (i < lines.length && (ordered ? /^\d+\.\s/.test(lines[i].trim()) : lines[i].trim().startsWith("- "))) {
        items.push(<li key={i} className="pl-1">{inline(lines[i].trim().replace(ordered ? /^\d+\.\s/ : /^-\s/, ""))}</li>);
        i++;
      }
      i--;
      blocks.push(<List key={i} start={start} className={`my-5 space-y-2 pl-6 leading-8 text-slate-700 ${ordered ? "list-decimal" : "list-disc"}`}>{items}</List>);
    } else {
      blocks.push(<p key={i} className="mb-5 leading-8 text-slate-700">{inline(text)}</p>);
    }
  }
  return <Fragment>{blocks}</Fragment>;
}
