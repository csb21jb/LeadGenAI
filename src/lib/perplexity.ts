/**
 * Represents a person found through the search API.
 */
export interface PersonResult {
  id: number;
  full_name: string;
  professional_profile: {
    current_role?: {
      title?: string;
      company?: string;
      responsibilities?: string[];
      duration?: string;
    };
    company_info?: {
      size?: string;
      industry?: string;
      recent_news?: {
        title: string;
        url: string;
        date?: string;
      }[];
    };
    previous_roles?: {
      title: string;
      company: string;
      duration?: string;
      description?: string;
    }[];
    skills?: string[];
    education?: {
      degree: string;
      institution: string;
      year?: string;
    }[];
    languages?: string[];
    location?: string;
  };
  contact_details?: {
    linkedin_url?: string;
    twitter_url?: string;
    facebook_url?: string;
    instagram_url?: string;
    other_social_urls?: {
      platform: string;
      url: string;
    }[];
    professional_groups?: {
      name: string;
      url?: string;
    }[];
    personal_website?: string;
    company_email_pattern?: string;
  };
  content?: {
    presentations?: {
      title: string;
      event?: string;
      date?: string;
      url?: string;
    }[];
    articles?: {
      title: string;
      publication?: string;
      date?: string;
      url: string;
    }[];
    podcasts?: {
      title: string;
      show: string;
      date?: string;
      url: string;
    }[];
    videos?: {
      title: string;
      platform: string;
      date?: string;
      url: string;
    }[];
    publications?: {
      title: string;
      type: string;
      year?: string;
      url?: string;
    }[];
  };
  business_activities?: {
    company_news?: {
      title: string;
      date?: string;
      description?: string;
      url: string;
    }[];
    funding_info?: {
      round: string;
      amount?: string;
      date?: string;
      url?: string;
    }[];
    product_launches?: {
      name: string;
      description?: string;
      date?: string;
      url?: string;
    }[];
    mentioned_pain_points?: string[];
    tech_stack?: string[];
  };
  personal_insights?: {
    professional_interests?: string[];
    communication_style?: string;
    achievements?: string[];
    volunteer_work?: {
      organization?: string;
      role?: string;
      cause?: string;
    }[];
    personal_interests?: string[];
  };
  engagement_recommendations?: {
    conversation_starters?: string[];
    potential_pain_points?: string[];
    best_channels?: string[];
    mutual_connections?: string[];
    talking_points?: string[];
  };
  search_date: string;
  sources?: {
    url: string;
    title: string;
  }[];
} 