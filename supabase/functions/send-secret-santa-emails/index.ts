
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface Assignment {
  giver: {
    id: string;
    name: string;
    email: string;
  };
  receiver: {
    id: string;
    name: string;
    email: string;
  };
}

interface EmailRequest {
  eventId: string;
  assignments: Assignment[];
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { eventId, assignments }: EmailRequest = await req.json();
    
    console.log(`Processing ${assignments.length} assignments for event ${eventId}`);

    // Send individual emails to each participant
    const emailPromises = assignments.map(async (assignment) => {
      const emailHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Votre Secret Santa 🎄</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              line-height: 1.6; 
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header { 
              background: linear-gradient(135deg, #dc2626, #16a34a);
              color: white;
              padding: 30px;
              text-align: center;
              border-radius: 10px 10px 0 0;
            }
            .content { 
              background: #f9fafb;
              padding: 30px;
              border-radius: 0 0 10px 10px;
              border: 1px solid #e5e7eb;
            }
            .gift-box {
              background: linear-gradient(135deg, #dc2626, #16a34a);
              color: white;
              padding: 20px;
              margin: 20px 0;
              text-align: center;
              border-radius: 10px;
              font-size: 18px;
              font-weight: bold;
            }
            .footer {
              text-align: center;
              margin-top: 30px;
              color: #6b7280;
              font-size: 14px;
            }
            .emoji { font-size: 24px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1><span class="emoji">🎄</span> Secret Santa <span class="emoji">🎁</span></h1>
            <p>Ho ho ho! Votre assignment est arrivé!</p>
          </div>
          
          <div class="content">
            <h2>Bonjour ${assignment.giver.name}! 👋</h2>
            
            <p>C'est le moment le plus magique de l'année! Votre assignment pour le Secret Santa a été généré:</p>
            
            <div class="gift-box">
              🎁 Vous êtes le Secret Santa de: <br>
              <strong>${assignment.receiver.name}</strong>
            </div>
            
            <p><strong>Quelques règles à retenir:</strong></p>
            <ul>
              <li>🤫 Gardez votre assignment secret!</li>
              <li>🎁 Préparez un cadeau thoughtful</li>
              <li>✨ Amusez-vous et répandez la joie de Noël!</li>
            </ul>
            
            <p>Que la magie de Noël guide votre choix de cadeau! 🌟</p>
            
            <div class="footer">
              <p>🎄 Joyeux Noël et bonne chance! 🎄</p>
              <p><em>Secret Santa Generator</em></p>
            </div>
          </div>
        </body>
        </html>
      `;

      return resend.emails.send({
        from: "Secret Santa <onboarding@resend.dev>",
        to: [assignment.giver.email],
        subject: `🎄 Votre Secret Santa assignment - ${assignment.giver.name}!`,
        html: emailHtml,
      });
    });

    // Wait for all emails to be sent
    const results = await Promise.allSettled(emailPromises);
    
    // Count successful and failed emails
    const successful = results.filter(result => result.status === 'fulfilled').length;
    const failed = results.filter(result => result.status === 'rejected').length;

    console.log(`Email results: ${successful} successful, ${failed} failed`);

    // Log any errors
    results.forEach((result, index) => {
      if (result.status === 'rejected') {
        console.error(`Failed to send email to ${assignments[index].giver.email}:`, result.reason);
      }
    });

    return new Response(
      JSON.stringify({ 
        success: true, 
        sent: successful, 
        failed: failed,
        message: `${successful} emails sent successfully${failed > 0 ? `, ${failed} failed` : ''}` 
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error("Error in send-secret-santa-emails function:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      {
        status: 500,
        headers: { 
          "Content-Type": "application/json", 
          ...corsHeaders 
        },
      }
    );
  }
};

serve(handler);
