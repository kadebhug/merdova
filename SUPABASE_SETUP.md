# Sanaflower Supabase Setup Instructions

## Prerequisites
- A Supabase account (sign up at https://supabase.com)
- Node.js and npm installed

## Step 1: Create a Supabase Project
1. Go to https://supabase.com and sign in
2. Click "New Project"
3. Fill in your project details and wait for it to be created

## Step 2: Get Your Credentials
1. In your Supabase project dashboard, go to Settings > API
2. Copy your **Project URL** and **anon/public key**

## Step 3: Configure Environment Variables
1. Create a `.env.local` file in the root of your project (f:\dev\merdova_v2)
2. Add the following lines, replacing with your actual credentials:

```
VITE_SUPABASE_URL=your-project-url.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

## Step 4: Create the Database Table
1. In your Supabase dashboard, go to the SQL Editor
2. Run the following SQL command:

```sql
create table flower_entries (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  entry_date date default current_date not null,
  title text,
  content_items jsonb not null default '[]'::jsonb,
  flower_color text default '#eab308'
);

-- Enable Row Level Security (optional but recommended)
alter table flower_entries enable row level security;

-- Create a policy to allow all operations (adjust based on your needs)
create policy "Allow all operations"
  on flower_entries
  for all
  using (true)
  with check (true);
```

### Updating Existing Table
If you already created the table, run this command to add the `title` column:

```sql
alter table flower_entries add column title text;
```

## Step 5: Create Storage Buckets
1. In your Supabase dashboard, go to Storage
2. Create a new bucket called `flower-images`
   - Set it to **Public** so images can be displayed
3. Create another bucket called `flower-audio`
   - Set it to **Public** so audio can be played

### Setting Bucket Policies
For each bucket, you may need to set policies to allow uploads:

1. Click on the bucket name
2. Go to "Policies"
3. Create a new policy with the following settings:
   - Policy name: "Allow public uploads"
   - Allowed operations: INSERT, SELECT
   - Policy definition: `true` (or customize based on your auth needs)

## Step 6: Restart Your Dev Server
After setting up the environment variables, restart your development server:

```bash
npm run dev
```

## Testing the Setup
1. Navigate to `/sanaflower` in your application
2. Click the "+ Add Entry" button in the top-right corner
3. Add some content (text, image, or audio)
4. Submit the entry
5. A new flower should appear on the canvas
6. Click the flower to view your entry content

## Troubleshooting

### "Failed to create entry" error
- Check that your environment variables are set correctly
- Verify the table was created successfully
- Check the browser console for detailed error messages

### Images/Audio not uploading
- Ensure the storage buckets are created and set to public
- Check that the bucket policies allow uploads
- Verify the bucket names match exactly: `flower-images` and `flower-audio`

### No flowers appearing
- Check the browser console for errors
- Verify your Supabase credentials are correct
- Make sure the table has the correct schema

## Notes
- The `mockFlowerData` array is still used for visual variety when generating flowers
- Each entry gets a random color from the mock data
- Entries are displayed in chronological order (oldest to newest)
- Content items within an entry are displayed in the order they were added
