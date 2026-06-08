/**
 * Layer-2 component-token registration list.
 *
 * Each component owns its tokens via a co-located `tokens.ts` that calls
 * `registerComponent(meta, { ... })` at module load. This file imports
 * each one for its side effect so the registry self-populates, no
 * destructure, no spread, just one line per component.
 *
 * To onboard a new component: drop `tokens.ts` next to its `meta.ts` with
 * a `registerComponent(meta, { ... })` call, then add one side-effect
 * import line below.
 */

import './accordion/tokens';
import './alert/tokens';
import './alert-dialog/tokens';
import './avatar/tokens';
import './badge/tokens';
import './breadcrumb/tokens';
import './brika-logo/tokens';
import './button/tokens';
import './button-group/tokens';
import './calendar/tokens';
import './card/tokens';
import './chart/tokens';
import './checkbox/tokens';
import './clay-logo/tokens';
import './code-block/tokens';
import './combobox/tokens';
import './command/tokens';
import './data-table/tokens';
import './date-picker/tokens';
import './dialog/tokens';
import './drawer/tokens';
import './color-picker/tokens';
import './dropdown-menu/tokens';
import './dropzone/tokens';
import './empty-state/tokens';
import './field/tokens';
import './file-upload/tokens';
import './hover-card/tokens';
import './icon/tokens';
import './input-group/tokens';
import './input-otp/tokens';
import './input/tokens';
import './kbd/tokens';
import './menubar/tokens';
import './mini-calendar/tokens';
import './navigation-menu/tokens';
import './page-header/tokens';
import './pagination/tokens';
import './popover/tokens';
import './progress-display/tokens';
import './progress/tokens';
import './radio-group/tokens';
import './resizable/tokens';
import './scroll-area/tokens';
import './section/tokens';
import './section-label/tokens';
import './select/tokens';
import './separator/tokens';
import './sheet/tokens';
import './sidebar/tokens';
import './skeleton/tokens';
import './slider/tokens';
import './spinner/tokens';
import './switch/tokens';
import './table/tokens';
import './tabs/tokens';
import './textarea/tokens';
import './toast/tokens';
import './toggle/tokens';
import './toggle-group/tokens';
import './tooltip/tokens';
import './tree/tokens';
