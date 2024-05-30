
umbraco-setup
powershell

---
# Prompt for Umbraco version (optional)
$umbracoVersion = Read-Host "Enter the Umbraco version (leave blank for latest)"

# Prompt for additional NuGet packages
$nugetPackages = Read-Host "Enter a comma-separated list of NuGet packages to install (leave blank for none)"

# Create Docker Compose file content
$dockerComposeContent = @"
version: '3.4'

services:
  umbraco:
    image: umbraco/umbraco:${umbracoVersion}
    ports:
      - "8080:80"
    environment:
      - ASPNETCORE_ENVIRONMENT=Development
      - DOTNET_USE_POLLING_FILE_WATCHER=1
    volumes:
      - ./umbraco-data:/app/umbraco-data
      - ./media:/app/wwwroot/media
    depends_on:
      - sql

  sql:
    image: mcr.microsoft.com/mssql/server:2019-latest
    environment:
      SA_PASSWORD: "Your_password123"
      ACCEPT_EULA: "Y"
    ports:
      - "1433:1433"
"@

# Write Docker Compose file
$dockerComposeFilePath = "docker-compose.yml"
$dockerComposeContent | Out-File -FilePath $dockerComposeFilePath -Encoding utf8

# Create a Dockerfile for customizations
$dockerfileContent = @"
FROM umbraco/umbraco:${umbracoVersion}

# Install uSync and Umbraco Forms
RUN dotnet add package uSync.Complete
RUN dotnet add package Umbraco.Forms

# Install additional NuGet packages
"@

if ($nugetPackages) {
    $packages = $nugetPackages -split ","
    foreach ($package in $packages) {
        $dockerfileContent += "RUN dotnet add package $package`n"
    }
}

# Write Dockerfile
$dockerfilePath = "Dockerfile"
$dockerfileContent | Out-File -FilePath $dockerfilePath -Encoding utf8

# Build and run the Docker containers
docker-compose up -d --build

# Create frontend folder and initialize Vite
$frontendPath = "frontend"
mkdir $frontendPath
cd $frontendPath

# Initialize npm and install Vite and other packages
npm init -y
npm install vite tailwindcss sass postcss autoprefixer lit

# Create Vite configuration file
$viteConfigContent = @"
import { defineConfig } from 'vite';
import postcss from './postcss.config.js';

export default defineConfig(({ command, mode }) => {
  return {
    build: {
      rollupOptions: {
        input: {
          backoffice: './backoffice/index.js',
          website: './website/index.js'
        }
      }
    },
    css: {
      postcss
    },
    esbuild: {
      jsxFactory: 'h',
      jsxFragment: 'Fragment'
    }
  };
});
"@

$viteConfigFilePath = "vite.config.js"
$viteConfigContent | Out-File -FilePath $viteConfigFilePath -Encoding utf8

# Create PostCSS configuration file
$postcssConfigContent = @"
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
"@

$postcssConfigFilePath = "postcss.config.js"
$postcssConfigContent | Out-File -FilePath $postcssConfigFilePath -Encoding utf8

# Create Tailwind CSS configuration file
$tailwindConfigContent = @"
module.exports = {
  purge: [],
  darkMode: false,
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
"@

$tailwindConfigFilePath = "tailwind.config.js"
$tailwindConfigContent | Out-File -FilePath $tailwindConfigFilePath -Encoding utf8

# Create entry files for backoffice and website
mkdir backoffice
$backofficeIndexContent = @"
import { html, LitElement } from 'lit';

class BackofficeComponent extends LitElement {
  render() {
    return html`<h1>Backoffice</h1>`;
  }
}

customElements.define('backoffice-component', BackofficeComponent);
"@
$backofficeIndexFilePath = "backoffice/index.js"
$backofficeIndexContent | Out-File -FilePath $backofficeIndexFilePath -Encoding utf8

mkdir website
$websiteIndexContent = @"
import { html, LitElement } from 'lit';

class WebsiteComponent extends LitElement {
  render() {
    return html`<h1>Website</h1>`;
  }
}

customElements.define('website-component', WebsiteComponent);
"@
$websiteIndexFilePath = "website/index.js"
$websiteIndexContent | Out-File -FilePath $websiteIndexFilePath -Encoding utf8

# Update package.json with scripts
$json = Get-Content package.json -Raw | ConvertFrom-Json
$json.scripts.dev = "vite build -m development --watch"
$json.scripts.prod = "vite build"
$json | ConvertTo-Json -Compress | Set-Content package.json

Write-Host "Umbraco setup is complete. Access it at http://localhost:8080"
Write-Host "Frontend setup is complete. Use 'npm run dev' for development and 'npm run prod' for production builds."
