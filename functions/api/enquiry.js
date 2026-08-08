export async function onRequestPost({ request, env }) {
  try {
    const data = await request.json();

    // 1. Honeypot check
    if (data.honeypot) {
      // Spam detected. Return a fake success response.
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 2. Basic Validation
    const { name, email, date, venue, message, source } = data;
    if (!name || !email || !date || !venue || !message) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 3. Very Basic Rate Limiting
    // In CF Pages, true rate limiting requires WAF or Workers KV/Durable Objects.
    // For a simple function without KV set up, we rely on the honeypot and CF's built-in DDoS protections.
    // However, if the client sends too many requests quickly, we would ideally block them here.
    
    // 4. Submit to Supabase
    const supabaseUrl = `https://arlwezgblzgktpqrorpj.supabase.co/rest/v1/enquiries`;
    const supabaseKey = env.SUPABASE_SERVICE_KEY; // Must be set in Pages environment variables

    if (!supabaseKey) {
      console.error("Missing SUPABASE_SERVICE_KEY environment variable");
      throw new Error("Server configuration error");
    }

    const payload = {
      name,
      email,
      event_date: date,
      venue,
      message,
      source: source || 'lighting',
      created_at: new Date().toISOString()
    };

    const supabaseResponse = await fetch(supabaseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify(payload)
    });

    if (!supabaseResponse.ok) {
      const errorText = await supabaseResponse.text();
      console.error("Supabase error:", errorText);
      throw new Error("Failed to write to database");
    }

    // Success
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error("Enquiry submission error:", error);
    return new Response(JSON.stringify({ 
      error: 'Failed to submit enquiry',
      message: 'Something went wrong. Please try again or email us directly.'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
