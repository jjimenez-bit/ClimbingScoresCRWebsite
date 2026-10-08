export interface Competition {
  id: string;
  name: string;
  location: string;
  country_code: string;
  start_date: string;
  end_date: string;
  discipline: "Boulder" | "Lead" | "Combined" | "Speed";
  status: "Completed" | "Ongoing" | "Upcoming";
  participants_count?: number;
}

export interface CompetitionResult {
  rank: number;
  athlete_id: string;
  athlete_name: string;
  country: string;
  category: string;
  score: string;
  qualification_rank?: number;
  semi_rank?: number;
  final_rank?: number;
}

export interface RouteDetail {
  route_name: string;
  round: "Clasificatoria" | "Semifinal" | "Final";
  tops: number;
  zones: number;
  top_attempts: number;
  zone_attempts: number;
}

// Added for Athletes Directory
export interface Athlete {
  id: string;
  first_name: string;
  last_name: string;
  country_code: string;
  country_name: string;
  category: "Senior" | "U20" | "U18" | "Paraclimbing";
  discipline_primary: "Boulder" | "Lead" | "Combined" | "Speed";
  current_rank?: number;
  total_podiums?: number;
  avatar_url?: string;
  bio?: string;
}

export interface AthletePlacement {
  competition_id: string;
  competition_name: string;
  date: string;
  discipline: string;
  rank: number;
  score: string;
}