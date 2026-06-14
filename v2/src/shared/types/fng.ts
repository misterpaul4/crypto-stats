export interface FngEntry {
  value: string;
  value_classification: string;
  timestamp: string;
  time_until_update?: string;
}

export interface FngResponse {
  name: string;
  data: FngEntry[];
  metadata: { error: string | null };
}
