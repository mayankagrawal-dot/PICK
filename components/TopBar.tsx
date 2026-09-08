export function TopBar() {
  return (
    <header className="flex flex-wrap items-baseline justify-between gap-2 px-6 pb-2 pt-7 sm:px-10">
      <div>
        <span className="text-[28px] font-black tracking-tight">PICK</span>
        <span className="ml-2.5 text-[13px] font-medium text-muted">Break the Autopilot</span>
      </div>
      <div className="text-[13px] font-semibold italic text-muted">
        Notice the urge. Choose the next move.
      </div>
    </header>
  );
}
