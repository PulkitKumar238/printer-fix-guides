import type { FunnelSession } from "./funnel";

export const PROCESS_DURATION_MS = 30_000;
export const GUIDED_REVIEW_RESULT = "Guided review completed; no device scan performed";
export const SUPPORT_REFERENCE_CODE = "0002X0";
export const PROCESS_MESSAGES = [
  "Checking requirements...",
  "Reviewing printer model information...",
  "Confirming connection types...",
  "Preparing setup guidance...",
  "Reviewing available troubleshooting options...",
  "Completing the guided process...",
];
export const VERIFIED_CORRUPTED_SYSTEM_FILES_ERROR =
  "operation could not be completed due to corrupted system files";

export const submittedModel = (value: string) => value.trim();
export const retryPatch: Partial<FunnelSession> = {
  brand: undefined, model: undefined, device: undefined, connection: undefined,
  result: undefined, callbackSent: false,
};
export function progressAt(elapsedMs: number, durationMs = PROCESS_DURATION_MS) {
  const percentage = Math.max(0, Math.min(100, Math.floor(elapsedMs / durationMs * 100)));
  const messageIndex = Math.min(PROCESS_MESSAGES.length - 1, Math.floor(elapsedMs / (durationMs / PROCESS_MESSAGES.length)));
  return { percentage, messageIndex: Math.max(0, messageIndex) };
}
