#!/usr/bin/env python3
import os
import subprocess
import sys
import platform

def check_command(command):
    """Check if a command is available in the system."""
    try:
        subprocess.run([command, '--version'], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        return True
    except FileNotFoundError:
        return False

def install_system_dependencies():
    """Install system-level dependencies based on the OS."""
    system = platform.system().lower()
    
    print("Checking and installing system dependencies...")
    
    if system == "linux":
        # For Ubuntu/Debian-based systems
        if check_command('apt'):
            print("Updating package lists...")
            subprocess.run(['sudo', 'apt', 'update'])
            print("Upgrading system packages...")
            subprocess.run(['sudo', 'apt', 'upgrade', '-y'])
            print("Installing required packages...")
            subprocess.run(['sudo', 'apt', 'install', '-y',
                'git',
                'nodejs',
                'npm',
                'python3-pip',
                'python3-venv',
                'sudo'
            ])
            # Ensure npm is up to date
            subprocess.run(['sudo', 'npm', 'install', '-g', 'npm@latest'])
        # For Red Hat/Fedora-based systems
        elif check_command('dnf'):
            print("Updating package lists...")
            subprocess.run(['sudo', 'dnf', 'check-update'])
            print("Upgrading system packages...")
            subprocess.run(['sudo', 'dnf', 'upgrade', '-y'])
            print("Installing required packages...")
            subprocess.run(['sudo', 'dnf', 'install', '-y',
                'git',
                'nodejs',
                'npm',
                'python3-pip',
                'python3-venv',
                'sudo'
            ])
            # Ensure npm is up to date
            subprocess.run(['sudo', 'npm', 'install', '-g', 'npm@latest'])
    elif system == "darwin":  # macOS
        if not check_command('brew'):
            print("Installing Homebrew...")
            subprocess.run(['/bin/bash', '-c', '$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)'])
        
        print("Updating Homebrew...")
        subprocess.run(['brew', 'update'])
        print("Upgrading Homebrew packages...")
        subprocess.run(['brew', 'upgrade'])
        print("Installing required packages...")
        subprocess.run(['brew', 'install',
            'git',
            'node',  # node includes npm
            'python3',
            'python3-venv',
            'sudo'
        ])
        # Ensure npm is up to date
        subprocess.run(['npm', 'install', '-g', 'npm@latest'])
    elif system == "windows":
        if not check_command('choco'):
            print("Please install Chocolatey package manager for Windows first.")
            print("Visit: https://chocolatey.org/install")
            sys.exit(1)
        
        print("Upgrading Chocolatey packages...")
        subprocess.run(['choco', 'upgrade', 'all', '-y'])
        print("Installing required packages...")
        subprocess.run(['choco', 'install', '-y',
            'git',
            'nodejs',  # includes npm
            'python3',
            'python3-venv',
            'sudo'
        ])
        # Ensure npm is up to date
        subprocess.run(['npm', 'install', '-g', 'npm@latest'])

def setup_git():
    """Configure git if not already configured."""
    try:
        # Check if git is configured
        subprocess.run(['git', 'config', '--get', 'user.name'], 
                      stdout=subprocess.PIPE, 
                      stderr=subprocess.PIPE)
        subprocess.run(['git', 'config', '--get', 'user.email'], 
                      stdout=subprocess.PIPE, 
                      stderr=subprocess.PIPE)
    except subprocess.CalledProcessError:
        print("\nGit needs to be configured. Please enter your details:")
        name = input("Enter your name: ")
        email = input("Enter your email: ")
        subprocess.run(['git', 'config', '--global', 'user.name', name])
        subprocess.run(['git', 'config', '--global', 'user.email', email])

def setup_node_project():
    """Install Node.js dependencies and setup the project."""
    print("\nSetting up Node.js project...")
    
    # Verify npm is installed
    if not check_command('npm'):
        print("Error: npm is not installed. Please ensure Node.js and npm are properly installed.")
        sys.exit(1)
    
    # Update npm to latest version
    print("Updating npm to latest version...")
    subprocess.run(['npm', 'install', '-g', 'npm@latest'])
    
    # Install Node.js dependencies
    if os.path.exists('package.json'):
        print("Installing Node.js dependencies...")
        subprocess.run(['npm', 'install'])
        
        # Install development dependencies if any
        if os.path.exists('package-lock.json'):
            subprocess.run(['npm', 'install', '--dev'])
        
        # Check for funding opportunities
        print("\nChecking for package funding opportunities...")
        subprocess.run(['npm', 'fund'])
    else:
        print("Error: package.json not found. Please ensure you're in the correct directory.")
        sys.exit(1)

def setup_python_environment():
    """Setup Python virtual environment and install dependencies."""
    print("\nSetting up Python environment...")
    
    # Create virtual environment
    subprocess.run([sys.executable, '-m', 'venv', 'venv'])
    
    # Activate virtual environment
    if platform.system().lower() == "windows":
        activate_script = os.path.join('venv', 'Scripts', 'activate')
    else:
        activate_script = os.path.join('venv', 'bin', 'activate')
    
    # Install Python dependencies
    if os.path.exists('requirements.txt'):
        if platform.system().lower() == "windows":
            subprocess.run([os.path.join('venv', 'Scripts', 'pip'), 'install', '-r', 'requirements.txt'])
        else:
            subprocess.run([os.path.join('venv', 'bin', 'pip'), 'install', '-r', 'requirements.txt'])
    else:
        print("No requirements.txt found, installing basic dependencies...")
        if platform.system().lower() == "windows":
            subprocess.run([os.path.join('venv', 'Scripts', 'pip'), 'install',
                'requests',
                'python-dotenv'
            ])
        else:
            subprocess.run([os.path.join('venv', 'bin', 'pip'), 'install',
                'requests',
                'python-dotenv'
            ])

def create_env_file():
    """Create .env file if it doesn't exist."""
    if not os.path.exists('.env'):
        print("\nCreating .env file...")
        with open('.env', 'w') as f:
            f.write("""# OpenAI API Key
OPENAI_API_KEY=your_openai_api_key_here

# Environment
NODE_ENV=development

# Add any other environment variables here
""")
        print("Please update the .env file with your actual API keys and configuration.")

def main():
    """Main setup function."""
    print("Starting project setup...")
    
    # Check and install system dependencies
    install_system_dependencies()
    
    # Setup git
    setup_git()
    
    # Setup Node.js project
    setup_node_project()
    
    # Setup Python environment
    setup_python_environment()
    
    # Create .env file
    create_env_file()
    
    print("\nSetup completed successfully!")
    print("\nNext steps:")
    print("1. Update the .env file with your API keys")
    print("2. Run 'npm run dev' to start the development server")
    print("3. Visit http://localhost:3000 to view your application")

if __name__ == "__main__":
    main() 