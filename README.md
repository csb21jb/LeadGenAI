
![LeadGenAI](https://github.com/user-attachments/assets/95da51e3-8079-47e2-a127-f8529917abdf)

# LeadGenuis - AI-Powered Lead Generation Platform

A modern web application for AI-powered lead generation and prospecting, built with Next.js, TypeScript, and Tailwind CSS.


https://github.com/user-attachments/assets/0c1067d4-a018-46b1-9d18-86f97e8f4d68


## Prerequisites

Before you begin, ensure you have the following installed:
- Python 3.8 or higher
- Node.js 18 or higher
- Git

For Windows users:
- [Chocolatey](https://chocolatey.org/install) package manager

For macOS users:
- [Homebrew](https://brew.sh/) package manager (will be installed automatically if not present)

For Linux users:
- `apt` or `dnf` package manager (depending on your distribution)

## Quick Start

1. Clone the repository:
   ```bash
   git clone https://github.com/csb21jb/LeadGenAI.git
   cd LeadGenAI
   ```
2. Install inital dependencies:
   ```bash
   apt update && upgrade
   apt install python3
   ```
3. Run the setup script:
   ```bash
   python3 setup.py
   ```
   This will:
   - Install system dependencies (git, nodejs, etc.)
   - Configure git if needed
   - Install Node.js dependencies
   - Create a Python virtual environment
   - Install Python dependencies
   - Create a template .env file

4. Configure your environment:
   - Open `.env` file
   - Add your OpenAI API key
   - Update any other necessary environment variables

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Visit `http://localhost:3000` in your browser

## Manual Setup (if setup.py fails)

1. Install system dependencies:
   - Git
   - Node.js
   - Python3

2. Install Node.js dependencies:
   ```bash
   npm install
   ```

3. Create and activate Python virtual environment:
   ```bash
   python3 -m venv venv
   # On Windows:
   .\venv\Scripts\activate
   # On Unix or MacOS:
   source venv/bin/activate
   ```

4. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

5. Create `.env` file:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   ```

## Features

- AI-powered lead research using OpenAI's web search
- Comprehensive lead profiles including:
  - Professional background
  - Company information
  - Digital presence
  - Business challenges
  - Outreach strategies
- Search history management
- Dark/Light mode support
- Responsive design

## Tech Stack

- Next.js 14
- TypeScript
- Tailwind CSS
- OpenAI API
- Python (for setup and utilities)


## License

This project is licensed under the MIT License - see the LICENSE file for details.
