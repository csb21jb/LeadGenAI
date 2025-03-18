import { NextResponse } from 'next/server';
import { searchPersonInfo, ProspectingInput } from '@/lib/openai-search';

// Maximum number of retries for the API call
const MAX_RETRIES = 3;

// Increase the response size limit to 50MB
export const maxDuration = 300; // 5 minutes
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

// Generate a basic HTML template when the API fails
const generateFallbackHtml = (name: string, company?: string) => {
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  return `
  <div class="lead-profile">
    <div class="profile-header">
      <h1>${name}</h1>
      <p class="last-updated">Last updated: ${currentDate}</p>
    </div>
    
    <div class="error-message">
      <h2>We encountered an issue retrieving information</h2>
      <p>We're sorry, but we couldn't retrieve the complete profile information at this time.</p>
      
      <h3>What we know:</h3>
      <ul>
        <li><strong>Name:</strong> ${name}</li>
        ${company ? `<li><strong>Company:</strong> ${company}</li>` : ''}
      </ul>
      
      <h3>Suggestions:</h3>
      <ul>
        <li>Try your search again in a few minutes</li>
        <li>Check your internet connection</li>
        <li>Verify the API key configuration</li>
        <li>Try a different name or company</li>
      </ul>
    </div>
  </div>`;
};

export async function POST(request: Request) {
  try {
    console.log('Generate prospects route called');
    
    // Log if API key is available
    console.log('API key available:', !!process.env.OPENAI_API_KEY);
    
    // Get request data
    const { name, email, company } = await request.json();
    console.log('Request data:', { name, email, company });
    
    // Validate input
    if (!name) {
      console.log('Error: Name is required');
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    // Verify API key
    if (!process.env.OPENAI_API_KEY) {
      console.error('No OpenAI API key found. Please set OPENAI_API_KEY in your environment');
      return NextResponse.json(
        { 
          error: 'OpenAI API key is required for this operation. Please configure your API key.',
          html: generateFallbackHtml(name, company) 
        },
        { status: 200 }
      );
    }
    
    // Implement retry logic for the API call
    let lastError = null;
    let htmlResult = null;
    
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        console.log(`Attempt ${attempt}/${MAX_RETRIES} to call OpenAI search API`);
        
        // Make the API call to get HTML content
        const response = await searchPersonInfo({ 
          name, 
          email, 
          company 
        });
        
        // Store the HTML result
        htmlResult = response.html;
        
        console.log('API call successful');
        break;
      } catch (searchError) {
        lastError = searchError;
        console.error(`Search API Error (Attempt ${attempt}/${MAX_RETRIES}):`, 
          searchError instanceof Error ? searchError.message : String(searchError));
        
        if (attempt < MAX_RETRIES) {
          // Wait a bit before retrying (exponential backoff)
          const delay = 1000 * Math.pow(2, attempt - 1); // 1s, 2s, 4s, etc.
          console.log(`Retrying in ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }
    
    // Check if any of the attempts were successful
    if (htmlResult) {
      // Return the successful result
      return NextResponse.json({ html: htmlResult });
    }
    
    // All attempts failed
    console.error('All API call attempts failed');
    return NextResponse.json(
      { 
        error: 'Search service unavailable after multiple attempts. Please try again later.',
        details: lastError instanceof Error ? lastError.message : String(lastError),
        html: generateFallbackHtml(name, company)
      },
      { status: 200 } // Return 200 status so frontend can still display the fallback HTML
    );
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Request error:', errorMessage);
    
    // For request errors, we might not have access to the parsed name/company variables
    // Use safe defaults in this case
    let safeName = "Unknown Person";
    let safeCompany = undefined;
    
    try {
      // Try to extract name/company from the request if possible
      const body = await request.json();
      safeName = body.name || safeName;
      safeCompany = body.company;
    } catch (e) {
      // Ignore any errors in extracting data from the request
      console.log('Could not extract request data for fallback template');
    }
    
    return NextResponse.json(
      { 
        error: 'Request error, please try again',
        details: errorMessage,
        html: generateFallbackHtml(safeName, safeCompany)
      },
      { status: 200 } // Return 200 status so frontend can still display the fallback HTML
    );
  }
}