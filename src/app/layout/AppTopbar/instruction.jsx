import { useRef } from "react";
import { OverlayPanel } from "primereact/overlaypanel";
import { Tooltip } from 'primereact/tooltip';

export const Instruction = () => {
  const op = useRef(null);

  const instructions = [
    "Use the sidebar to navigate between modules",
    "Check notifications for important updates",
    "Keep your profile information updated",
    "Change your password regularly for security",
  ];

  return (
    <>
      <Tooltip target="#instr-target" position="bottom" />
      <button
        id="instr-target"
        type="button"
        className="topbar-btn p-link w-10 h-10 flex items-center justify-center rounded-xl hover:bg-slate-50 transition-all active:scale-95 text-slate-600"
        onClick={(e) => op.current.toggle(e)}
        data-pr-tooltip="Quick Instructions"
      >
        <i className="pi pi-book text-lg"></i>
      </button>

      <OverlayPanel ref={op} dismissable className="mt-4">
        <div className="w-80 rounded-xl">
          <h4 className="font-semibold text-base mb-3">Quick Instructions</h4>

          <ul className="flex flex-col gap-2">
            {instructions.map((item, index) => (
              <li
                key={index}
                className="flex items-start gap-2 p-2 rounded-lg border"
              >
                <i className="pi pi-check-circle text-green-500 mt-1"></i>
                <span className="text-sm">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </OverlayPanel>
    </>
  );
};
