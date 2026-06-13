/** Alternative.me Fear & Greed Index. NOTE: every numeric field is a STRING. */
export interface FngEntry {
  value: string; // "0".."100"
  value_classification: string; // 'Extreme Fear' | 'Fear' | 'Neutral' | 'Greed' | 'Extreme Greed'
  timestamp: string; // unix SECONDS
  time_until_update?: string; // present only on the newest entry (data[0])
}

export interface FngResponse {
  name: string;
  data: FngEntry[]; // newest-first
  metadata: { error: string | null };
}
