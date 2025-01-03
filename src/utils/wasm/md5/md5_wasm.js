import * as wasm from "./md5_wasm_bg.wasm";
export * from "./md5_wasm_bg.js";
import { __wbg_set_wasm } from "./md5_wasm_bg.js";
__wbg_set_wasm(wasm);