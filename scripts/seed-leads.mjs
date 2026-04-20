const requiredEnv = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "SUPABASE_SERVICE_ROLE_KEY"
];

for (const name of requiredEnv) {
  if (!process.env[name]) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
}

const { createClient } = await import("@supabase/supabase-js");

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

const leads = [
  {
    name: "Aarav Mehta",
    email: "aarav@northstarlogistics.com",
    phone: "+91 98765 12340",
    message: "Looking for a lead intake workflow tied to campaign landing pages.",
    status: "new",
    score: 50
  },
  {
    name: "Sophia Turner",
    email: "sophia.turner@gmail.com",
    phone: "+1 202-555-0147",
    message: "Interested in a trial before bringing the sales team in.",
    status: "contacted",
    score: 20
  },
  {
    name: "Rahul Kapoor",
    email: "rahul@kapooradvisory.io",
    phone: "+91 98111 22009",
    message: "Needs CSV export and a simple admin dashboard for weekly operations.",
    status: "qualified",
    score: 50
  }
];

const { data, error } = await supabase.from("leads").insert(leads).select();

if (error) {
  throw error;
}

console.log(`Seeded ${data.length} leads.`);
