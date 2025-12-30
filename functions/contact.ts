export const onRequestPost: PagesFunction = async ({ request, env }) => {
    try {
      const formData = await request.formData();
  
      const name = String(formData.get("name") || "Anonymous");
      const email = String(formData.get("email") || "(no email)");
      const message = String(formData.get("message") || "");
      const subscribe = formData.get("subscribe") === "yes";
  
      const body = `
  New message from memorum.org
  
  Name: ${name}
  Email: ${email}
  Subscribe to updates: ${subscribe ? "Yes" : "No"}
  
  Message:
  ${message}
  `;
  
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "Memorum <contact@memorum.org>",
          to: ["contact@memorum.org"],
          subject: "New message from memorum.org",
          text: body,
        }),
      });
  
      if (!res.ok) {
        const errText = await res.text();
        return new Response(
          `Failed to send email: ${errText}`,
          { status: 500 }
        );
      }
  
      return new Response("OK", { status: 200 });
    } catch (err) {
      return new Response("Server error", { status: 500 });
    }
  };
  