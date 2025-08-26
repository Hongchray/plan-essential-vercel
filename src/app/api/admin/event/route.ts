export async function POST(req: Request) {
    const userId = req.headers.get("user-id");
    if (!userId) {
        return new Response("User ID is required", { status: 400 });
    }
  const { id } = await req.json()

}