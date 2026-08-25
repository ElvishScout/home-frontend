import { PageHead } from "../components/page-head";
import { RowList, type Row } from "../components/row-list";

export const metadata = {
  title: "音乐创作",
};

const TRACKS: Row[] = [
  { num: "TRK.01", title: "四和弦也能打", note: "LOOP · C MAJ · 92 BPM", meta: "01:36" },
  { num: "TRK.02", title: "左手先学会走路", note: "PRACTICE · A MIN · 76 BPM", meta: "02:04" },
  { num: "TRK.03", title: "给新番 OP 的仿写练习", note: "DEMO · 128 BPM", meta: "01:12" },
];

export default function MusicPage() {
  return (
    <>
      <PageHead tag="MUSIC WORKS" title="音乐创作" meta="LOOPS 12 ✦ DEMOS 3 · TARGET: ONE FULL TRACK" />
      <RowList rows={TRACKS} />
      <p className="mt-8 font-spacemono text-xs tracking-[0.16em] opacity-60">
        更多 DEMO 在硬盘里排队。MORE DEMOS IN THE VAULT.
      </p>
    </>
  );
}
