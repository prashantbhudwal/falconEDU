import prisma from "@/prisma";

type LoginRequestBody = {
  username: string;
  password: string;
};

export async function POST(request: Request) {
  const body: LoginRequestBody = await request.json();
  const { username, password } = body;

  try {
    const user = await prisma.teacher.findUnique({
      where: {
        email: username,
      },
    });

    if (user && user.password === password) {
      const { password, ...userWithoutPassword } = user;
      return new Response(JSON.stringify(userWithoutPassword));
    } else {
      return new Response(
        JSON.stringify({ message: "Username or password is incorrect" }),
        {
          status: 401,
        }
      );
    }
  } catch (error) {
    console.error("Error retrieving user data:", error);
    return new Response(
      JSON.stringify({ message: "Error retrieving user data" }),
      {
        status: 500,
      }
    );
  }
}
