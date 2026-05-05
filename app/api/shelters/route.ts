import sheltersData from "@/data/shelters.json"

export async function GET() {
  return Response.json(sheltersData)
}
