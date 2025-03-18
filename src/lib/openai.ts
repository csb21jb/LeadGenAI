import OpenAI from 'openai';

export interface ProspectingPrompt {
  name: string;
  email?: string;
  company?: string;
}

export interface PersonResult {
  id: number;
  full_name: string;
  professional_profile: {
    current_role: {
      title: string;
      company: string;
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
  contact_details: {
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
  content: {
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
  business_activities: {
    company_news?: {
      title: string;
      date?: string;
      description: string;
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
      description: string;
      date?: string;
      url?: string;
    }[];
    mentioned_pain_points?: string[];
    tech_stack?: string[];
  };
  personal_insights: {
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
  engagement_recommendations: {
    conversation_starters?: string[];
    potential_pain_points?: string[];
    best_channels?: string[];
    mutual_connections?: string[];
    talking_points?: string[]; // New field for detailed talking points
  };
  raw_content?: Record<string, unknown>; // For storing any additional data
  search_date: string; // When this search was performed
  sources?: {url: string, title: string}[]; // Sources found during web search
}

// Setup OpenAI
const setupOpenAI = () => {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is not defined');
  }
  
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });
};

export async function generateProspects(input: ProspectingPrompt): Promise<{ results: PersonResult[] }> {
  try {
    const openai = setupOpenAI();
    
    // Crafting a detailed prompt that directly maps to our JSON structure
    const detailedJSONPrompt = `
I need comprehensive information about ${input.name}${input.company ? ` who works at ${input.company}` : ''}.

Please provide the following information in a STRUCTURED JSON format:

{
  "full_name": "${input.name}",
  "professional_profile": {
    "current_role": {
      "title": "Job title",
      "company": "${input.company || ''}",
      "responsibilities": ["Responsibility 1", "Responsibility 2"],
      "duration": "Time in role"
    },
    "company_info": {
      "size": "Company size",
      "industry": "Industry",
      "recent_news": [
        {"title": "News title", "url": "URL", "date": "Date"}
      ]
    },
    "previous_roles": [
      {
        "title": "Previous job title",
        "company": "Previous company",
        "duration": "Time period",
        "description": "Brief description"
      }
    ],
    "skills": ["Skill 1", "Skill 2"],
    "education": [
      {
        "degree": "Degree",
        "institution": "School",
        "year": "Year"
      }
    ],
    "languages": ["Language 1", "Language 2"],
    "location": "Current location"
  },
  "contact_details": {
    "linkedin_url": "LinkedIn URL",
    "twitter_url": "Twitter URL",
    "facebook_url": "Facebook URL",
    "instagram_url": "Instagram URL",
    "other_social_urls": [
      {
        "platform": "Platform name",
        "url": "URL"
      }
    ],
    "professional_groups": [
      {
        "name": "Group name",
        "url": "URL"
      }
    ],
    "personal_website": "Website URL",
    "company_email_pattern": "Email pattern"
  },
  "content": {
    "presentations": [
      {
        "title": "Presentation title",
        "event": "Event name",
        "date": "Date",
        "url": "URL"
      }
    ],
    "articles": [
      {
        "title": "Article title",
        "publication": "Publication",
        "date": "Date",
        "url": "URL"
      }
    ],
    "podcasts": [
      {
        "title": "Episode title",
        "show": "Podcast name",
        "date": "Date",
        "url": "URL"
      }
    ],
    "videos": [
      {
        "title": "Video title",
        "platform": "Platform",
        "date": "Date",
        "url": "URL"
      }
    ],
    "publications": [
      {
        "title": "Publication title",
        "type": "Type",
        "year": "Year",
        "url": "URL"
      }
    ]
  },
  "business_activities": {
    "company_news": [
      {
        "title": "News title",
        "date": "Date",
        "description": "Description",
        "url": "URL"
      }
    ],
    "funding_info": [
      {
        "round": "Funding round",
        "amount": "Amount",
        "date": "Date",
        "url": "URL"
      }
    ],
    "product_launches": [
      {
        "name": "Product name",
        "description": "Description",
        "date": "Date",
        "url": "URL"
      }
    ],
    "mentioned_pain_points": ["Pain point 1", "Pain point 2"],
    "tech_stack": ["Technology 1", "Technology 2"]
  },
  "personal_insights": {
    "professional_interests": ["Interest 1", "Interest 2"],
    "communication_style": "Communication style description",
    "achievements": ["Achievement 1", "Achievement 2"],
    "volunteer_work": [
      {
        "organization": "Organization name",
        "role": "Role",
        "cause": "Cause"
      }
    ],
    "personal_interests": ["Interest 1", "Interest 2"]
  },
  "engagement_recommendations": {
    "conversation_starters": ["Starter 1", "Starter 2"],
    "potential_pain_points": ["Pain point 1", "Pain point 2"],
    "best_channels": ["Channel 1", "Channel 2"],
    "mutual_connections": ["Connection 1", "Connection 2"],
    "talking_points": [
      "Detailed talking point 1 - be specific about recent news or accomplishments",
      "Detailed talking point 2 - reference industry challenges they're facing",
      "Detailed talking point 3 - mention specific expertise areas",
      "Detailed talking point 4 - note recent company news or changes",
      "Detailed talking point 5 - highlight potential collaboration opportunities"
    ]
  }
}

I need ONLY the JSON object in your response - no introduction, explanation, or other text. For fields where you don't have information, use empty arrays [] or null values rather than omitting fields.

Make all talking points personalized, detailed, and actionable based on real information found.`;

    console.log('Calling OpenAI with prompt about:', input.name);
    
    let sources: {url: string, title: string}[] = [];
    let response;
    
    try {
      // Use the exact parameters from the working example you provided
      console.log("Using gpt-4o-mini-search-preview with web search");
      response = await openai.chat.completions.create({
        model: "gpt-4o-mini-search-preview",
        web_search_options: {
          search_context_size: "medium"
        },
        messages: [
          { role: "user", content: detailedJSONPrompt }
        ]
      });
      
      console.log("Successfully called OpenAI web search API");
      
      // Extract citations/sources if they exist
      if (response.choices[0]?.message?.annotations) {
        const annotations = response.choices[0].message.annotations;
        for (const annotation of annotations) {
          if (annotation.type === 'url_citation' && annotation.url_citation) {
            sources.push({
              url: annotation.url_citation.url,
              title: annotation.url_citation.title
            });
          }
        }
        console.log(`Found ${sources.length} sources from web search`);
      }
    } catch (error) {
      console.error("Web search model failed:", error instanceof Error ? error.message : String(error));
      
      // Fallback to GPT-4
      try {
        console.log("Falling back to GPT-4");
        response = await openai.chat.completions.create({
          model: "gpt-4",
          messages: [
            { 
              role: "system", 
              content: "You are an AI that helps generate detailed, structured information about people in JSON format. Your output must strictly be JSON only with no explanatory text."
            },
            { role: "user", content: detailedJSONPrompt }
          ]
        });
        console.log("Successfully used GPT-4 fallback");
      } catch (gpt4Error) {
        console.error("GPT-4 fallback failed:", gpt4Error instanceof Error ? gpt4Error.message : String(gpt4Error));
        throw gpt4Error;
      }
    }
    
    const content = response.choices[0]?.message?.content;
    
    if (!content) {
      throw new Error('Empty response from API');
    }
    
    try {
      // Try to parse the response as JSON - don't make any changes to the structure
      const parsedResponse = JSON.parse(content);
      
      // Add the current date and sources
      const currentDate = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
      parsedResponse.id = 1;
      parsedResponse.search_date = currentDate;
      
      if (sources.length > 0) {
        parsedResponse.sources = sources;
      }
      
      // Return the result directly
      return { 
        results: [parsedResponse]
      };
    } catch (error) {
      console.error('Error parsing JSON response:', error);
      console.log('First 500 chars of content:', content.substring(0, 500));
      
      // If JSON parsing fails, return a standardized format
      const currentDate = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
      
      // Create a fallback result
      return {
        results: [{
          id: 1,
          full_name: input.name,
          professional_profile: {
            current_role: {
              title: 'Information Found',
              company: input.company || 'Unknown'
            },
            location: 'Unknown'
          },
          contact_details: {},
          content: {},
          business_activities: {},
          personal_insights: {
            professional_interests: ["Information could not be properly structured"]
          },
          engagement_recommendations: {
            talking_points: [
              "The information was found but could not be properly formatted.",
              "Please try another search or contact the developer."
            ]
          },
          sources: sources.length > 0 ? sources : undefined,
          search_date: currentDate,
          raw_content: { fullContent: content }
        }]
      };
    }
  } catch (error) {
    console.error('Error in generateProspects:', error);
    throw error;
  }
}