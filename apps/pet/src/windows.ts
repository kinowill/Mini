export interface WindowRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

type Win32Func = (...args: unknown[]) => unknown;

const GWL_EXSTYLE = -20;
const WS_EX_TOOLWINDOW = 0x00000080;
const DWMWA_CLOAKED = 14;
const DWMWA_EXTENDED_FRAME_BOUNDS = 9;

let EnumWindows: Win32Func | null = null;
let IsWindowVisible: Win32Func | null = null;
let IsIconic: Win32Func | null = null;
let GetWindowRect: Win32Func | null = null;
let GetWindowThreadProcessId: Win32Func | null = null;
let GetWindowLongPtrW: Win32Func | null = null;
let DwmGetWindowAttribute: Win32Func | null = null;
let DwmGetWindowAttributeRect: Win32Func | null = null;

let currentSelfPid = 0;
let collected: WindowRect[] = [];
let enumCallback: unknown = null;

async function ensureLoaded(): Promise<void> {
  if (EnumWindows) return;
  const koffi = await import("koffi");
  const user32 = koffi.load("user32.dll");
  const dwmapi = koffi.load("dwmapi.dll");

  const HWND = koffi.pointer("HWND", koffi.opaque());
  const RECT = koffi.struct("RECT", {
    left: "int32",
    top: "int32",
    right: "int32",
    bottom: "int32",
  });

  EnumWindows = user32.func("int __stdcall EnumWindows(void *lpEnumFunc, intptr_t lParam)");
  IsWindowVisible = user32.func("int __stdcall IsWindowVisible(HWND hWnd)");
  IsIconic = user32.func("int __stdcall IsIconic(HWND hWnd)");
  GetWindowRect = user32.func("int __stdcall GetWindowRect(HWND hWnd, _Out_ RECT *lpRect)");
  GetWindowThreadProcessId = user32.func(
    "uint32 __stdcall GetWindowThreadProcessId(HWND hWnd, _Out_ uint32 *lpdwProcessId)"
  );
  GetWindowLongPtrW = user32.func(
    "intptr_t __stdcall GetWindowLongPtrW(HWND hWnd, int nIndex)"
  );
  DwmGetWindowAttribute = dwmapi.func(
    "int __stdcall DwmGetWindowAttribute(HWND hwnd, uint32 dwAttribute, _Out_ uint32 *pvAttribute, uint32 cbAttribute)"
  );
  DwmGetWindowAttributeRect = dwmapi.func(
    "int __stdcall DwmGetWindowAttribute(HWND hwnd, uint32 dwAttribute, _Out_ RECT *pvAttribute, uint32 cbAttribute)"
  );

  const WNDENUMPROC = koffi.proto("int __stdcall WNDENUMPROC(HWND hwnd, intptr_t lParam)");
  enumCallback = koffi.register((hwnd: unknown) => {
    try {
      if (!IsWindowVisible?.(hwnd)) return 1;
      if (IsIconic?.(hwnd)) return 1;
      const exStyle = GetWindowLongPtrW?.(hwnd, GWL_EXSTYLE);
      if (Number(exStyle) & WS_EX_TOOLWINDOW) return 1;
      const pidOut = [0];
      GetWindowThreadProcessId?.(hwnd, pidOut);
      if (pidOut[0] === currentSelfPid) return 1;
      const cloakedOut = [0];
      const hr = DwmGetWindowAttribute?.(hwnd, DWMWA_CLOAKED, cloakedOut, 4);
      if (hr === 0 && cloakedOut[0] !== 0) return 1;
      const rectOut: Array<{
        left: number;
        top: number;
        right: number;
        bottom: number;
      } | null> = [null];
      const hrRect = DwmGetWindowAttributeRect?.(hwnd, DWMWA_EXTENDED_FRAME_BOUNDS, rectOut, 16);
      const rect = hrRect === 0 && rectOut[0] ? rectOut[0] : null;
      if (!rect) {
        const ok = GetWindowRect?.(hwnd, rectOut);
        if (!ok || !rectOut[0]) return 1;
      }
      const r = rect ?? rectOut[0]!;
      const width = r.right - r.left;
      const height = r.bottom - r.top;
      if (width <= 0 || height <= 0) return 1;
      collected.push({ x: r.left, y: r.top, width, height });
    } catch {
      // window state changed mid-enumeration; skip it
    }
    return 1;
  }, koffi.pointer(WNDENUMPROC));
}

export async function enumerateVisibleWindows(selfPid: number): Promise<WindowRect[]> {
  await ensureLoaded();
  currentSelfPid = selfPid;
  collected = [];
  EnumWindows?.(enumCallback, 0);
  return collected;
}
