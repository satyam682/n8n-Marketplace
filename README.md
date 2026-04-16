<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/8b149d0f-a4f4-48ce-b7c5-4de345ed7a74

## Run Locally

**Prerequisites:** Node.js

1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key

## Import n8n Templates from CSV

To import your 1200 n8n templates from a CSV file:

1. **Prepare your CSV file** with the following columns:
   - `title` - Template title
   - `description` - Template description
   - `category` - Template category (e.g., AI, Marketing, Sales, DevOps, etc.)
   - `downloadUrl` - Direct download URL for the template
   - `score` - Rating out of 10 (e.g., 8.5)
   - `authorName` (optional) - Author name
   - `tags` (optional) - Comma-separated tags

2. **Place your CSV file** in the project root directory (e.g., `n8n-templates.csv`)

3. **Run the import script**:

   ```bash
   npm run import-templates n8n-templates.csv
   ```

4. **Start the development server**:
   ```bash
   npm run dev
   ```

The templates will be imported into the SQLite database and displayed category-wise on the marketplace page. Each template will get randomly generated stars and downloads based on its score.
