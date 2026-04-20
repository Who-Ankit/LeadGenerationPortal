import { NextRequest, NextResponse } from "next/server";
import { calculateLeadScore } from "@/lib/lead-scoring";
import { createAdminSupabaseClient } from "@/lib/supabase/server";

type LeadPayload = {
  name: string;
  email: string;
  phone?: string;
  message?: string;
};

type LeadUpdatePayload = {
  id: string;
  status: string;
};

function normalizeStatus(value: string | null) {
  if (!value) {
    return null;
  }

  const normalized = value.toLowerCase();
  const supported = ["new", "contacted", "qualified"];
  return supported.includes(normalized) ? normalized : null;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as LeadPayload;

    if (!body.name?.trim() || !body.email?.trim()) {
      return NextResponse.json({ error: "Name and email are required." }, { status: 400 });
    }

    const score = calculateLeadScore(body.email);
    const supabase = createAdminSupabaseClient();

    const { data, error } = await supabase
      .from("leads")
      .insert({
        name: body.name.trim(),
        email: body.email.trim().toLowerCase(),
        phone: body.phone?.trim() || null,
        message: body.message?.trim() || null,
        status: "new",
        score
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ lead: data }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Unable to create lead.", details: String(error) }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = createAdminSupabaseClient();
    const token = request.headers.get("authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const {
      data: { user },
      error: authError
    } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const status = normalizeStatus(searchParams.get("status"));
    const date = searchParams.get("date");

    let query = supabase.from("leads").select("*").order("created_at", { ascending: false });

    if (status) {
      query = query.eq("status", status);
    }

    if (date) {
      const start = new Date(`${date}T00:00:00.000Z`);
      const end = new Date(`${date}T23:59:59.999Z`);
      query = query.gte("created_at", start.toISOString()).lte("created_at", end.toISOString());
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ leads: data });
  } catch (error) {
    return NextResponse.json({ error: "Unable to fetch leads.", details: String(error) }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const supabase = createAdminSupabaseClient();
    const token = request.headers.get("authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const {
      data: { user },
      error: authError
    } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const body = (await request.json()) as LeadUpdatePayload;
    const status = normalizeStatus(body.status);

    if (!body.id?.trim() || !status) {
      return NextResponse.json({ error: "Lead id and valid status are required." }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("leads")
      .update({ status })
      .eq("id", body.id.trim())
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ lead: data });
  } catch (error) {
    return NextResponse.json({ error: "Unable to update lead.", details: String(error) }, { status: 500 });
  }
}
