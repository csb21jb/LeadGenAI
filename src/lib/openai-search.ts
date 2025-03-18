import OpenAI from 'openai';

// Set up the OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface ProspectingInput {
  name: string;
  company: string;
  email?: string;
}

/**
 * Performs a web search using OpenAI's gpt-4o-mini-search-preview model
 * and returns formatted HTML results.
 * 
 * @param input Object containing name, company (optional), and email (optional)
 * @param location Optional location information
 * @param contextSize Level of context for the search (low, medium, high)
 * @returns The search result as HTML content
 */
export async function searchPersonInfo(
  input: ProspectingInput, 
  location: { country: string; city: string; region: string } = { country: "US", city: "New York", region: "NY" },
  contextSize: "low" | "medium" | "high" = "medium"
) {
  // Create web search options
  const webSearchOptions = {
    search_context_size: contextSize
  } as any;

  // Include user location if provided
  if (location) {
    webSearchOptions.user_location = {
      type: "approximate",
      approximate: location,
    };
  }

  // Build the query string requesting HTML format instead of JSON
  const query = `I need comprehensive, sales-focused information about ${input.name}${input.company ? ` who works at ${input.company}` : ''} that a sales representative can use for cold outreach.

Please provide the information in a CLEAN, STRUCTURED HTML format using the following exact sections and HTML structure:

<h2>Professional Summary</h2>
<div class="section-content">
  <div class="key-value"><strong>Current Title:</strong> [Their exact job title]</div>
  <div class="key-value"><strong>Company:</strong> [Current company]</div>
  <div class="key-value"><strong>Tenure:</strong> [How long they've been in this role]</div>
  <div class="key-value"><strong>Location:</strong> [City, State/Region, Country]</div>
  <div class="key-value"><strong>Industry:</strong> [Their industry]</div>
  <p>[2-3 sentence professional summary focusing on their responsibilities and authority]</p>
</div>

<h2>Company Information</h2>
<div class="section-content">
  <div class="key-value"><strong>Company Name:</strong> [Full legal name]</div>
  <div class="key-value"><strong>Industry:</strong> [Primary industry]</div>
  <div class="key-value"><strong>Size:</strong> [Employee count if available]</div>
  <div class="key-value"><strong>Revenue:</strong> [Annual revenue if available]</div>
  <div class="key-value"><strong>Founded:</strong> [Year founded]</div>
  <div class="key-value"><strong>Headquarters:</strong> [HQ location]</div>
  <div class="key-value"><strong>Website:</strong> <a href="[URL]" target="_blank">[URL]</a></div>
  <h3>Company Description</h3>
  <p>[3-4 sentence description of what the company does, their market position, and recent news]</p>
  <h3>Products/Services</h3>
  <ul>
    [List main products or services as bullet points]
  </ul>
</div>

<h2>Decision-Making Authority</h2>
<div class="section-content">
  <div class="key-value"><strong>Role Type:</strong> [Executive/Director/Manager/Individual Contributor]</div>
  <div class="key-value"><strong>Department:</strong> [Their department]</div>
  <div class="key-value"><strong>Likely Reports To:</strong> [Their probable boss's title]</div>
  <div class="key-value"><strong>Budget Authority:</strong> [High/Medium/Low/Unknown]</div>
  <p>[Assessment of their probable decision-making power and influence in the organization]</p>
</div>

<h2>Career Background</h2>
<div class="section-content">
  <h3>Previous Roles</h3>
  <ul>
    [List previous positions with company names and approximate dates]
  </ul>
  <h3>Education</h3>
  <ul>
    [List educational background with degrees, institutions and years if available]
  </ul>
  <h3>Skills & Expertise</h3>
  <ul>
    [List 5-7 key professional skills or areas of expertise]
  </ul>
</div>

<h2>Digital Presence</h2>
<div class="section-content">
  <h3>Social Profiles</h3>
  <ul>
    <li><strong>LinkedIn:</strong> <a href="[URL]" target="_blank">[Profile name/URL]</a></li>
    <li><strong>Twitter/X:</strong> <a href="[URL]" target="_blank">[Handle]</a></li>
    [Any other professional social media profiles]
  </ul>
  <h3>Content & Publications</h3>
  <ul>
    [List recent articles, interviews, podcasts, videos, or presentations with links]
  </ul>
</div>

<h2>Business Challenges & Opportunities</h2>
<div class="section-content">
  <h3>Company Challenges</h3>
  <ul>
    [List 3-5 specific challenges the company is facing based on news, earnings calls, etc.]
  </ul>
  <h3>Industry Trends</h3>
  <ul>
    [List 3-4 major trends affecting their industry that are relevant to sales outreach]
  </ul>
  <h3>Technology Stack</h3>
  <ul>
    [List technologies, platforms or tools the company is known to use if available]
  </ul>
</div>

<h2>Outreach Strategy</h2>
<div class="section-content">
  <h3>Conversation Starters</h3>
  <div class="talking-point">[Detailed conversation starter based on recent company news]</div>
  <div class="talking-point">[Detailed conversation starter based on their professional background]</div>
  <div class="talking-point">[Detailed conversation starter based on industry trends]</div>
  
  <h3>Pain Points to Address</h3>
  <ul>
    [List 3-4 specific pain points this person likely experiences that your solution could address]
  </ul>
  
  <h3>Best Contact Approach</h3>
  <p>[Recommendations for contacting this person - email versus call, best times, etc.]</p>
  
  <h3>Email Template</h3>
  <div class="data-point">
    <strong>Subject Line:</strong> [Personalized email subject line]
  </div>
  <div class="data-point">
    <p><strong>Email Body:</strong><br>
    Hi [First Name],<br><br>
    [2-3 sentence personalized opening referencing something specific about them or their company]<br><br>
    [1-2 sentences connecting their situation to your solution]<br><br>
    [1 sentence clear call-to-action]<br><br>
    Best regards,<br>
    [Sales Rep Name]
    </p>
  </div>
</div>

When generating this information:
1. Focus on business-relevant details that would be useful for sales outreach
2. Be specific and detailed rather than generic whenever possible
3. Include information about business challenges, priorities, and decision-making authority
4. For all URLs, use proper HTML formatting with target="_blank" attributes
5. Use the HTML class names exactly as shown above
6. If certain information isn't available, still include the section headers but note "Information not available" rather than omitting sections
7. Do NOT include any markdown formatting, backticks, or code block indicators in your response
8. DO NOT include your own header or wrapper - return only the sections as specified above
9. Return clean HTML only, ready to be injected into a webpage

Remember to maintain an organized, professional tone throughout the document, focusing on information that would help a sales representative craft personalized outreach.`;

  try {
    // Make the OpenAI API call
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini-search-preview",
      web_search_options: webSearchOptions,
      messages: [
        { role: "user", content: query }
      ],
      max_tokens: 4096  // Keep only max_tokens as it's needed for longer responses
    });

    // Extract the content
    const htmlContent = response.choices[0].message.content || '';
    
    // Extract any citations/sources that might be available
    let sourcesHtml = '';
    
    try {
      if (response.choices[0]?.message?.annotations) {
        const annotations = response.choices[0].message.annotations;
        const sources: { url: string; title: string }[] = [];
        
        for (const annotation of annotations) {
          if (annotation.type === 'url_citation' && annotation.url_citation) {
            sources.push({
              url: annotation.url_citation.url,
              title: annotation.url_citation.title
            });
          }
        }
        
        if (sources.length > 0) {
          sourcesHtml = `
          <div class="sources-section">
            <h2>Sources</h2>
            <ul>
              ${sources.map(source => `
                <li>
                  <a href="${source.url}" target="_blank">${source.title}</a>
                </li>
              `).join('')}
            </ul>
          </div>`;
        }
      }
    } catch (annotationError) {
      console.error("Error processing annotations:", annotationError);
    }
    
    // Add a wrapper and the current date if not already included
    const currentDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    // Clean up HTML by finding the main content between potential comments or markdown code blocks
    let cleanedHtml = htmlContent;
    
    // If the response is wrapped in a markdown code block, extract it
    if (htmlContent.includes('```html')) {
      const matches = htmlContent.match(/```html\s*([\s\S]*?)\s*```/);
      if (matches && matches[1]) {
        cleanedHtml = matches[1].trim();
      }
    } else if (htmlContent.includes('```')) {
      // Handle case where the code block doesn't specify language
      const matches = htmlContent.match(/```\s*([\s\S]*?)\s*```/);
      if (matches && matches[1]) {
        cleanedHtml = matches[1].trim();
      }
    }
    
    // Remove any lingering markdown indicators or html tags
    cleanedHtml = cleanedHtml
      .replace(/^```|```$/g, '')         // Remove any remaining backticks at start/end
      .replace(/^html|^HTML/g, '')       // Remove html/HTML word at beginning
      .replace(/^<html>|<\/html>$/g, '') // Remove <html> tags if present
      .trim();                           // Trim whitespace
    
    // Wrap the HTML content in a container and add the sources
    const wrappedHtml = `
    <div class="lead-profile">
      <div class="profile-header">
        <h1>${input.name}</h1>
        <p class="last-updated">Last updated: ${currentDate}</p>
      </div>
      ${cleanedHtml}
      ${sourcesHtml}
    </div>`;
    
    return {
      html: wrappedHtml,
      searchDate: currentDate
    };
  } catch (error) {
    console.error("OpenAI API error:", error);
    throw error;
  }
}