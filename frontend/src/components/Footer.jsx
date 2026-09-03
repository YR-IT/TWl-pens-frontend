export default function Footer() {
  return (
    <footer className="mt-32 border-t border-[#E6E0D6] bg-[#F3EFEA]">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12 py-16 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div className="md:col-span-2">
          <p className="text-xs uppercase tracking-[0.25em] text-[#B8860B] mb-4">ATELIER · SINCE 2019</p>
          <h3 className="font-serif text-3xl lg:text-4xl text-[#1C1815] leading-[1.1] mb-4">
            Made for the<br/><em className="text-[#3D4838]">slow hand.</em>
          </h3>
          <p className="text-sm text-[#6E685E] max-w-md leading-relaxed">
            An atelier of writing instruments, gathered from Turin, Copenhagen and Kyoto.
            Each piece is inspected, hand-inked and shipped in walnut.
          </p>
        </div>
        <div>
          <h4 className="font-serif text-lg text-[#1C1815] mb-4">Explore</h4>
          <ul className="space-y-2 text-sm text-[#6E685E]">
            <li>Fountain Pens</li>
            <li>Rollerball</li>
            <li>Ballpoint</li>
            <li>Inks &amp; Journals</li>
            <li>Limited Editions</li>
          </ul>
        </div>
        <div>
          <h4 className="font-serif text-lg text-[#1C1815] mb-4">Atelier</h4>
          <ul className="space-y-2 text-sm text-[#6E685E]">
            <li>Studio &amp; Story</li>
            <li>Craftsmanship</li>
            <li>Shipping &amp; Returns</li>
            <li>Care Guide</li>
            <li>Contact</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-[#E6E0D6] py-6 px-6 lg:px-12 text-xs uppercase tracking-[0.2em] text-[#6E685E] flex flex-wrap justify-between gap-3 max-w-[1600px] mx-auto">
        <span>© 2026 Atelier Ink &amp; Steel</span>
        <span>Copenhagen · Turin · Kyoto</span>
      </div>
    </footer>
  );
}
