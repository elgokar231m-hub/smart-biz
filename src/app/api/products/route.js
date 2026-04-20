import { supabase } from "@/lib/supabase";

export async function GET() {
  try {
    const { data, error } = await supabase.from("products").select("*");
    if (error) {
      console.error("Supabase GET error:", JSON.stringify(error));
      return Response.json({ supabaseError: error.message, code: error.code }, { status: 500 });
    }
    return Response.json(data || []);
  } catch (e) {
    console.error("API crash:", e.message);
    return Response.json({ crash: e.message }, { status: 500 });
  }
}

export async function POST(request) {
  const body = await request.json();
  const { data, error } = await supabase.from("products").insert([body]).select();
  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json(data);
}

export async function DELETE(request) {
  const { id } = await request.json();
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ success: true });
}
