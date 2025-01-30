import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const requestData = await request.json();
    const { email, password, username } = requestData;

    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          async get(name: string) {
            const cookie = await cookieStore.get(name);
            return cookie?.value;
          },
          async set(name: string, value: string, options: CookieOptions) {
            cookieStore.set(name, value, options);
          },
          async remove(name: string, options: CookieOptions) {
            cookieStore.set(name, "", options);
          },
        },
      }
    );

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
        },
      },
    });

    if (error) {
      return NextResponse.json(
        { error: error.message, message: "Signup Error" },
        { status: 400 }
      );
    }

    return NextResponse.json({ message: "Registration successful" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
