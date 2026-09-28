import { NextResponse } from "next/server";
import OpenAI from "openai";

const HOTEL_CONTEXT = `You are Saksiri Concierge, the virtual hotel concierge for Saksiri Riverside Boutique Hotel in Vang Vieng, Laos.

HOTEL KNOWLEDGE:
- Hotel: Saksiri Riverside Boutique Hotel / Saksiri River Side Boutique Hotel.
- Location: Houy Yae/Houy Yare Village, Vang Vieng District, Vientiane Province, Laos, beside the Nam Song River.
- Public hotel site: saksirihotel.com.
- Publicly listed amenities include two swimming pools, a kids' pool, free Wi-Fi, free private parking, restaurant, bar, breakfast, room service, spa/wellness, spa tub, terrace, garden, private beach area, tour desk, 24-hour front desk, and river/mountain/garden/pool views.
- Public room categories include Deluxe Double, Deluxe Twin and Deluxe Superior. Public listings describe a Deluxe Double at about 32 m² and a Deluxe Superior at about 50 m². Room details can vary, so never invent an exact room feature unless stated here.
- Public contact numbers: +856 20 2243 0999 and +856 20 5431 8777. Email: saksirihotel@gmail.com.
- The official site presents a Book Now flow and a visual tour.
- Publicly listed dining includes American, Cantonese, Chinese, Asian, International and European cuisine; ambience is described as family-friendly, traditional and romantic.
- Vang Vieng is known for the Nam Song River, karst mountains, caves, viewpoints, lagoons, cycling, hiking, kayaking and other outdoor activities. Do not invent current opening hours, tour prices or transport schedules.

CONVERSATION RULES:
- Be warm, polished, concise and genuinely conversational, like a boutique hotel's human concierge.
- Remember the guest's previous messages and use them. Never reset to a generic greeting after the conversation has started.
- Answer the guest's actual question first, then add one useful detail or question when appropriate.
- If the guest gives dates, number of guests, purpose of trip, budget, room preference or interests, use those details in your answer.
- For couples/honeymoon guests, discuss Deluxe Double vs Deluxe Superior based only on known facts and ask whether they prioritize space, views or simplicity.
- For families, mention the kids' pool and family-friendly dining only as publicly listed; do not invent family-room availability.
- For amenities, group them naturally: pools/wellness, dining, practical services, outdoor setting.
- For a 2-5 day Vang Vieng itinerary, create a calm day-by-day plan using general activities such as river time, viewpoints, caves, lagoons, cycling and a relaxed hotel day. Clearly separate suggestions from confirmed hotel services.
- For booking, rates, live availability, exact cancellation rules or exact room inventory, say you do not have live booking access and direct the guest to Book Now or the hotel team.
- Never invent prices, availability, discounts, confirmation numbers, transfer times, opening hours or policies.
- If asked for transport, explain that the hotel can be contacted about airport/shuttle guidance, but do not promise a schedule or price.
- If asked about food, describe the publicly listed cuisines and breakfast, and offer to help plan dining around their preferences.
- If asked about local activities, give useful general ideas but do not present third-party tour availability as confirmed hotel service.
- If the user says hello, greet them naturally and offer 3 useful directions.
- If you don't know something, say so clearly and offer the best next step.
- Never claim to be a human employee. You are a virtual concierge.
`;

function fallback(messages: { role: string; content: string }[]) {
  const q = messages.at(-1)?.content.toLowerCase().trim() || "";
  const history = messages.slice(-6).map((m) => m.content.toLowerCase()).join(" ");

  if (/^(hi|hello|hey|good morning|good afternoon|good evening|sabaidee)\b/.test(q)) {
    return "Welcome to Saksiri. I can help you compare rooms, plan your Vang Vieng days, explore hotel amenities, or guide you toward booking. What are you planning?";
  }
  if (/thank|thanks/.test(q)) return "You're very welcome. If you'd like, I can also help you plan the rest of your Vang Vieng stay.";
  if (/room|suite|bed|sleep|deluxe|twin|double|couple|honeymoon|romantic/.test(q)) {
    return "For two people, the public room information points to the Deluxe Double (about 32 m²) or the larger Deluxe Superior (about 50 m²). If you tell me whether you care more about space, views or a simple comfortable stay, I can help you choose between them.";
  }
  if (/pool|swim|spa|wellness|breakfast|restaurant|dining|wifi|wi-fi|bar|garden|amenit|parking|beach/.test(q)) {
    return "Saksiri publicly lists two swimming pools, a kids' pool, restaurant and bar, breakfast, Wi-Fi, room service, spa/wellness, spa tub, garden and a private beach area. It also lists river, mountain, garden and pool views. Which part would you like me to explain?";
  }
  if (/book|reserv|availability|available|price|rate|cost|tonight|tomorrow|check.?in|check.?out/.test(q)) {
    return "I can guide you, but I don't have live room inventory or current rates. The safest next step is the hotel's Book Now flow or the hotel team at +856 20 2243 0999 / +856 20 5431 8777. If you give me your dates and number of guests, I can help you prepare what to ask for.";
  }
  if (/contact|email|phone|whatsapp|address|location|where/.test(q)) {
    return "Saksiri Riverside Boutique Hotel is in Houy Yae/Houy Yare Village, Vang Vieng, Vientiane Province, Laos. Public contacts are +856 20 2243 0999, +856 20 5431 8777 and saksirihotel@gmail.com.";
  }
  if (/food|eat|menu|cuisine|meal|dinner|lunch|breakfast/.test(q)) {
    return "The hotel's public listing describes American, Cantonese, Chinese, Asian, International and European cuisine, with family-friendly, traditional and romantic dining ambience. If you tell me what you like to eat, I can suggest how to approach dining during your stay.";
  }
  if (/vang vieng|activity|activities|thing|visit|tour|explore|cave|mountain|river|lagoon|itinerary|days|day trip|kayak|hike|cycling|bike/.test(q)) {
    const days = q.match(/(\d+)\s*day/)?.[1];
    if (days) return `For a ${days}-day Vang Vieng stay, I would balance one river/outdoor day, one mountain or cave day, and slower time around the hotel and gardens. If you tell me whether you prefer adventure, scenery or relaxation, I can turn that into a day-by-day plan.`;
    return "Vang Vieng is a strong mix of river time, limestone mountains, caves, viewpoints, lagoons, cycling, hiking and kayaking. Tell me how many days you have and whether you prefer relaxation, nature or adventure, and I'll build a simple plan.";
  }
  if (/family|child|kids|children/.test(q)) {
    return "Saksiri publicly lists a kids' pool and family-friendly dining ambience, alongside two swimming pools and garden/outdoor spaces. I can't confirm a specific family room without live booking access. Would you like help comparing rooms for your group?";
  }
  if (/couple|honeymoon|anniversary/.test(q)) {
    return "For a couple, I'd start by comparing the Deluxe Double and Deluxe Superior. The public listings describe them at about 32 m² and 50 m² respectively. If this is a romantic trip, tell me your dates and whether you value more space or a view, and I'll help you plan the stay.";
  }
  if (/history|previous|earlier|you said/.test(q) && history) return "Yes — I'm following the conversation. Tell me which part you'd like to continue with, such as the room choice, itinerary or booking guidance.";
  return "I can help with rooms, hotel amenities, dining, booking guidance, or a Vang Vieng itinerary. Tell me what you're planning and I'll tailor the answer to you.";
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const messages = Array.isArray(body?.messages)
      ? body.messages
          .filter((m: any) => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
          .slice(-18)
          .map((m: any) => ({ role: m.role, content: m.content.slice(0, 2500) }))
      : [];

    if (!messages.length) return NextResponse.json({ reply: "How can I help you plan your stay at Saksiri?" });

    const key = process.env.OPENAI_API_KEY?.trim();
    if (!key || key === "your_api_key_here") return NextResponse.json({ reply: fallback(messages) });

    const client = new OpenAI({ apiKey: key });
    const response = await client.responses.create({
      model: process.env.OPENAI_MODEL || "gpt-5-mini",
      instructions: HOTEL_CONTEXT,
      input: messages.map((m: any) => ({ role: m.role, content: m.content })),
      max_output_tokens: 420,
    });

    return NextResponse.json({ reply: response.output_text?.trim() || fallback(messages) });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ reply: "I can still help with rooms, amenities, dining and Vang Vieng planning. For live availability or rates, please use Book Now or contact the hotel team." });
  }
}
