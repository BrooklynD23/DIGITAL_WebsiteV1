import type { ChannelState } from '../_system';
import type { ModuleState } from '../_content/sidekick';

/** Signal Capture: state by line form, never colour. Fingerprint = stale side branch; carrier + sensor = paused. */
export const LINE_FORM: Readonly<Record<ModuleState, ChannelState>> = {
  routed: 'stale',
  'partly-routed': 'paused',
  schematic: 'paused',
  external: 'pending',
  research: 'pending',
};
