import { notFound } from "next/navigation";
import { fetchResearchDoc } from "@/lib/github";
import { ResearchDocView } from "@/components/research-doc-view";

export const dynamic = "force-dynamic";

export default async function AdminResearchDoc({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const doc = await fetchResearchDoc(slug);

  if (!doc) notFound();

  return <ResearchDocView slug={slug} title={doc.title} content={doc.content} />;
}
