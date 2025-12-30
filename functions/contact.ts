export const onRequestPost: PagesFunction = async ({ request, env }) => {
    const formData = await request.formData();
  
    const name = formData.get("name") || "Anonymous";
    const email = formData.get("email") || "(no email)";
    const message = formData.get("message") || "";
  
    const body = `
  New message from memorum.org
  
  Name: ${name}
  Email: ${email}
  
  Message:
  ${message}
  `;
  
    const response = await fetch("https://api.mailchannels.net/tx/v1/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        personalizations: [
          {
            to: [{ email: "contact@memorum.org" }],
          },
        ],
        from: {
          email: "no-reply@memorum.org",
          name: "Memorum",
        },
        subject: "New message from memorum.org",
        content: [
          {
            type: "text/plain",
            value: body,
          },
        ],
      }),
    });
  
    if (!response.ok) {
      return new Response("Failed to send message", { status: 500 });
    }
  
    return new Response("OK", { status: 200 });
  };
  