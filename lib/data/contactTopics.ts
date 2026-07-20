/**
 * Maps ?type= query values from involvement / landing links to contact form topic values.
 */

export const contactTopicOptions = [
  { value: 'general', label: 'General Inquiry' },
  { value: 'join', label: 'Joining the Team' },
  { value: 'project', label: 'Modular Phone Project' },
  { value: 'sponsorship', label: 'Sponsorship & Partnership' },
] as const;

export type ContactTopicValue = (typeof contactTopicOptions)[number]['value'];

/** URL ?type= values → contact form topic field values. */
export const contactTypeToTopic: Record<string, ContactTopicValue> = {
  membership: 'join',
  'project-team': 'join',
  leadership: 'join',
  mentorship: 'join',
  'alumni-network': 'join',
  mentor: 'join',
  speaker: 'general',
  sponsor: 'sponsorship',
  recruit: 'sponsorship',
  workshop: 'general',
  donate: 'general',
  project: 'project',
  join: 'join',
  sponsorship: 'sponsorship',
  general: 'general',
};

export function resolveContactTopic(typeParam: string | null): ContactTopicValue | '' {
  if (!typeParam) return '';
  return contactTypeToTopic[typeParam] ?? '';
}
