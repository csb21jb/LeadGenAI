# LeadGenuis - AI-Powered Lead Generation Platform

A modern web application for AI-powered lead generation and prospecting, built with Next.js, TypeScript, and Tailwind CSS.

## Features

- **AI-Powered Prospecting**: Generate potential leads using GPT-based analysis of company data and market signals
- **Dashboard**: View key metrics and stats about your prospecting activities
- **CSV Export**: Export prospect data for use in other tools
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- **Frontend**: Next.js with App Router, TypeScript, Tailwind CSS
- **AI Integration**: OpenAI API (GPT-4o-mini) for AI-powered prospecting
- **UI Components**: Custom components styled with Tailwind CSS
- **Icons**: Lucide React for beautiful and consistent iconography

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn
- OpenAI API key

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables:
   Create a `.env` file in the root directory with:
   ```
   OPENAI_API_KEY=your_openai_api_key
   OPENAI_MODEL=gpt4o-mini
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. Navigate to the Prospecting page
2. Fill in your details in the form
3. Submit to generate prospect leads
4. View generated prospects and download as CSV if needed

## Project Structure

- `/src/app` - Next.js App Router pages
- `/src/components` - Reusable UI components
- `/public` - Static assets

## License

MIT
